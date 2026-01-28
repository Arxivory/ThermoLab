import * as THREE from "three";
import type { CompiledSimulation } from "../types/CompiledSimulation";
import type { HeatGrid } from "../solvers/thermal/HeatGrid";
import { temperatureColor } from "./colormaps";

export class ThermalVisualizer {
    static update(
        simulation: CompiledSimulation,
        grids: HeatGrid[]
    ) {
        for (const grid of grids) {
            const obj = simulation.objects.find(o => o.id === grid.objectId);
            if (!obj || !obj.mesh) continue;

            const { min, max } = this.computeRange(grid);

            this.applyToMesh(obj.mesh, grid, min, max);
        }
    }

    private static computeRange(grid: HeatGrid) {
        let min = Infinity;
        let max = -Infinity;

        for (let i = 0; i < grid.temperature.length; i++) {
            if (grid.volumeFraction[i] > 0) {
                const T = grid.temperature[i];
                if (T < min) min = T;
                if (T > max) max = T;
            }
        }

        if (min === Infinity) { min = 293; max = 300; }
        return { min, max };
    }

    private static applyToMesh(
        mesh: THREE.Object3D,
        grid: HeatGrid,
        Tmin: number,
        Tmax: number
    ) {
        const VISUAL_MIN = 293.15;
        const VISUAL_MAX = 373.15;

        mesh.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;

            const geom = child.geometry as THREE.BufferGeometry;
            const posAttr = geom.attributes.position;
            const count = posAttr.count;

            if (!geom.attributes.color) {
                geom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
            }
            const colorAttr = geom.attributes.color;

            child.updateMatrixWorld();

            const tempPos = new THREE.Vector3();

            for (let i = 0; i < count; i++) {
                tempPos.fromBufferAttribute(posAttr, i);
                child.localToWorld(tempPos);

                const T = this.sampleGridPhysical(grid, tempPos);

                const Tnorm = (T - VISUAL_MIN) / (VISUAL_MAX - VISUAL_MIN || 1e-5);
                const c = temperatureColor(THREE.MathUtils.clamp(Tnorm, 0, 1));

                colorAttr.setXYZ(i, c.r, c.g, c.b);
            }

            colorAttr.needsUpdate = true;

            if (child.material instanceof THREE.MeshStandardMaterial || 
                child.material instanceof THREE.MeshPhysicalMaterial) {
                child.material.vertexColors = true;
                child.material.needsUpdate = true;
            }
        });
    }

    private static sampleGridPhysical(grid: HeatGrid, worldPos: THREE.Vector3): number {
        const { nx, ny, nz, dx, dy, dz, origin, temperature } = grid;

        const u = (worldPos.x - origin.x) / dx;
        const v = (worldPos.y - origin.y) / dy;
        const w = (worldPos.z - origin.z) / dz;

        const i0 = THREE.MathUtils.clamp(Math.floor(u), 0, nx - 1);
        const i1 = THREE.MathUtils.clamp(i0 + 1, 0, nx - 1);
        const j0 = THREE.MathUtils.clamp(Math.floor(v), 0, ny - 1);
        const j1 = THREE.MathUtils.clamp(j0 + 1, 0, ny - 1);
        const k0 = THREE.MathUtils.clamp(Math.floor(w), 0, nz - 1);
        const k1 = THREE.MathUtils.clamp(k0 + 1, 0, nz - 1);

        const tx = u - i0;
        const ty = v - j0;
        const tz = w - k0;

        const getT = (i: number, j: number, k: number) => {
            return temperature[i + nx * (j + ny * k)];
        };

        const c000 = getT(i0, j0, k0);
        const c100 = getT(i1, j0, k0);
        const c010 = getT(i0, j1, k0);
        const c110 = getT(i1, j1, k0);
        const c001 = getT(i0, j0, k1);
        const c101 = getT(i1, j0, k1);
        const c011 = getT(i0, j1, k1);
        const c111 = getT(i1, j1, k1);

        const c00 = c000 * (1 - tx) + c100 * tx;
        const c10 = c010 * (1 - tx) + c110 * tx;
        const c01 = c001 * (1 - tx) + c101 * tx;
        const c11 = c011 * (1 - tx) + c111 * tx;

        const c0 = c00 * (1 - ty) + c10 * ty;
        const c1 = c01 * (1 - ty) + c11 * ty;

        return c0 * (1 - tz) + c1 * tz;
    }
}