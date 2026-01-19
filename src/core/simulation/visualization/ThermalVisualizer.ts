import * as THREE from "three"
import type { ThermalState } from "../solvers/thermal/ThermalSolver"
import type { CompiledSimulation } from "../types/CompiledSimulation"
import { temperatureColor } from "./colormaps"
import type { HeatGrid } from "../solvers/thermal/HeatGrid"

export class ThermalVisualizer {
    static update(
        simulation: CompiledSimulation,
        thermal: ThermalState
    ) {
        for (const obj of simulation.objects) {
            const grid = thermal.grids.get(obj.id);
            if (!grid) continue;

            const { min, max } = this.computeRange(grid.temperature);

            this.applyToMesh(obj.mesh, grid, min, max);
        }
    }

    private static computeRange(arr: Float32Array) {
        let min = 293;
        let max = 400;

        for (let i = 0; i < arr.length; i++) {
            const v = arr[i];
            if (v < min) min = v;
            if (v > max) max = v;
        }

        return { min, max };
    }


    private static applyToMesh(
        mesh: THREE.Object3D,
        grid: any,
        Tmin: number,
        Tmax: number
    ) {
        mesh.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;
            if (!(child.geometry.attributes.position)) return;

            const geom = child.geometry as THREE.BufferGeometry;
            const pos = geom.attributes.position;
            const count = pos.count;

            let colors = 
                geom.attributes.color ??
                new THREE.BufferAttribute(new Float32Array(count * 3), 3);

            const bbox = new THREE.Box3().setFromBufferAttribute(pos);

            for (let i = 0; i < count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                const z = pos.getZ(i);

                const T = this.sampleGrid(grid, x, y, z, bbox);
                const Tnorm = (T - Tmin) / (Tmax - Tmin + 1e-5);
                const c = temperatureColor(THREE.MathUtils.clamp(Tnorm, 0, 1));

                colors.setXYZ(i, c.r, c.g, c.b);
            }

            geom.setAttribute("color", colors);
            geom.attributes.color.needsUpdate = true;

            const mat = child.material as THREE.MeshPhysicalMaterial;
            mat.vertexColors = true;
            mat.needsUpdate = true;
        })
    }

    private static sampleGrid(
        grid: HeatGrid,
        x: number, y: number, z: number,
        bbox: THREE.Box3
    ): number {
        const { nx, ny, nz, temperature } = grid;

        const u = (x - bbox.min.x) / (bbox.max.x - bbox.min.x) * (nx - 1);
        const v = (y - bbox.min.y) / (bbox.max.y - bbox.min.y) * (ny - 1);
        const w = (z - bbox.min.z) / (bbox.max.z - bbox.min.z) * (nz - 1);

        const i0 = Math.floor(u), i1 = Math.min(i0 + 1, nx - 1);
        const j0 = Math.floor(v), j1 = Math.min(j0 + 1, ny - 1);
        const k0 = Math.floor(w), k1 = Math.min(k0 + 1, nz - 1);

        const tx = u - i0;
        const ty = v - j0;
        const tz = w - k0;

        const idx = (i: number, j: number, k: number) => i + nx * (j + ny * k);

        const c000 = temperature[idx(i0, j0, k0)];
        const c100 = temperature[idx(i1, j0, k0)];
        const c010 = temperature[idx(i0, j1, k0)];
        const c110 = temperature[idx(i1, j1, k0)];
        const c001 = temperature[idx(i0, j0, k1)];
        const c101 = temperature[idx(i1, j0, k1)];
        const c011 = temperature[idx(i0, j1, k1)];
        const c111 = temperature[idx(i1, j1, k1)];

        const c00 = c000 * (1 - tx) + c100 * tx;
        const c10 = c010 * (1 - tx) + c110 * tx;
        const c01 = c001 * (1 - tx) + c101 * tx;
        const c11 = c011 * (1 - tx) + c111 * tx;

        const c0 = c00 * (1 - ty) + c10 * ty;
        const c1 = c01 * (1 - ty) + c11 * ty;

        return c0 * (1 - tz) + c1 * tz;
    }
}