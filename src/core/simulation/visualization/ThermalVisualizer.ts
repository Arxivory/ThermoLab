import * as THREE from "three"
import type { ThermalState } from "../solvers/thermal/ThermalSolver"
import type { CompiledSimulation } from "../types/CompiledSimulation"
import { temperatureColor } from "./colormaps"

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
        let min = Infinity;
        let max = -Infinity;

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
                const Tnorm = (T - Tmin) / (Tmax - Tmin + 1e-6);
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
        grid: any,
        x: number,
        y: number,
        z: number,
        bbox: THREE.Box3
    ): number {
        const { nx, ny, nz, temperature } = grid;

        const u = (x - bbox.min.x) / (bbox.max.x - bbox.min.x);
        const v = (y - bbox.min.y) / (bbox.max.y - bbox.min.y);
        const w = (z - bbox.min.z) / (bbox.max.z - bbox.min.z);

        const i = Math.min(nx - 1, Math.max(0, Math.floor(u * nx)));
        const j = Math.min(ny - 1, Math.max(0, Math.floor(v * ny)));
        const k = Math.min(nz - 1, Math.max(0, Math.floor(w * nz)));

        const idx = i + nx * (j + ny * k);
        const T = temperature[idx];

        return T;
    }
}