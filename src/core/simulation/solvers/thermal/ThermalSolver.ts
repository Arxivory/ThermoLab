import type { CompiledObject, CompiledSimulation } from "../../types/CompiledSimulation";
import { applyBoundaryConditions } from "./BoundaryHandlers";
import type { HeatGrid } from "./HeatGrid";
import * as THREE from "three";
import { ThermalCoupling } from "./ThermalCoupling";

export interface ThermalState {
    grids: Map<string, HeatGrid>;
}

export class ThermalSolver {

    static initialize(simulation: CompiledSimulation): ThermalState {
        const grids = new Map<string, HeatGrid>();

        for (const obj of simulation.objects) {
            const grid = this.createGrid(obj);
            
            applyBoundaryConditions(obj.id, grid, simulation);
            
            grids.set(obj.id, grid);
        }

        for (const obj of simulation.objects) {
            obj.mesh.updateWorldMatrix(true);
        }


        return { grids };
    }

    private static createGrid(object: CompiledObject): HeatGrid {
        const nx = 20, ny = 20, nz = 20;
        const size = nx * ny * nz;

        const bbox = new THREE.Box3().setFromObject(object.mesh);
        const boxSize = new THREE.Vector3();
        bbox.getSize(boxSize);

        const dx = boxSize.x / nx;
        const dy = boxSize.y / ny;
        const dz = boxSize.z / nz;

        return {
            nx, ny, nz,
            dx, dy, dz,
            origin: bbox.min.clone(),
            temperature: new Float32Array(size).fill(293),
            nextTemperature: new Float32Array(size).fill(293),
            objectId: object.id
        };
    }

    static apply(
        simulation: CompiledSimulation,
        state: ThermalState,
        dt: number
    ) {
        for (const obj of simulation.objects) {
            obj.mesh.updateWorldMatrix(true);
        }

        for (const obj of simulation.objects) {
            const grid = state.grids.get(obj.id)!;
            grid.nextTemperature.set(grid.temperature);
            this.solveDiffusion(obj, grid, dt);
        }
        
        ThermalCoupling.apply(simulation, state.grids, dt);
        
        for (const grid of state.grids.values()) {
            this.swap(grid);
        }
    }

    private static solveDiffusion(obj: any, grid: HeatGrid, dt: number) {
        const { nx, ny, nz, temperature, nextTemperature } = grid;
        const { thermalConductivity, density, specificHeat } = obj.material;
        
        const alpha = thermalConductivity / (density * specificHeat);

        const idx = (i: number, j: number, k: number) =>
            i + nx * (j + ny * k);

        for (let k = 1; k < nz - 1; k++) {
            for (let j = 1; j < ny - 1; j++) {
                for (let i = 1; i < nx - 1; i++) {
                    const id = idx(i, j, k);

                    const dx2 = grid.dx * grid.dx;

                    const laplacian = 
                        (temperature[idx(i + 1, j, k)] +
                        temperature[idx(i - 1, j, k)] +
                        temperature[idx(i, j + 1, k)] +
                        temperature[idx(i, j - 1, k)] +
                        temperature[idx(i, j, k + 1)] +
                        temperature[idx(i, j, k - 1)] -
                        6 * temperature[id]) / dx2;

                    nextTemperature[id] = 
                        temperature[id] + alpha * laplacian * dt;
                }
            }
        }
    }

    private static swap(grid: HeatGrid) {
        const temp = grid.temperature;
        grid.temperature = grid.nextTemperature;
        grid.nextTemperature = temp;
    }
}