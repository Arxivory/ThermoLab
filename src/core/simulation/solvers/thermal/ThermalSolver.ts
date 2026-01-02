import type { CompiledSimulation } from "../../types/CompiledSimulation";
import { applyBoundaryConditions } from "./BoundaryHandlers";
import type { HeatGrid } from "./HeatGrid";

export class ThermalSolver {
    private grids = new Map<string, HeatGrid>();
    private simulation;

    constructor(sim: CompiledSimulation) {
        this.simulation = sim;
        this.initializeGrids();
    }

    private initializeGrids() {
        for (const obj of this.simulation.objects) {
            const grid = this.createGridForObject(obj.id);
            this.grids.set(obj.id, grid);
        }
    }

    private createGridForObject(objectId: string): HeatGrid {
        const nx = 20, ny = 20, nz = 20;
        const size = nx * ny * nz;

        return {
            nx, ny, nz,
            dx: 1, dy: 1, dz: 1,
            temperature: new Float32Array(size).fill(293),
            nextTemperature: new Float32Array(size).fill(293)
        };
    }

    step(dt: number) {
        for (const obj of this.simulation.objects) {
            const grid = this.grids.get(obj.id)!;
            this.solveDiffusion(obj, grid, dt);
            applyBoundaryConditions(obj.id, grid, this.simulation);
            this.swap(grid);
        }
    }

    private solveDiffusion(obj: any, grid: HeatGrid, dt: number) {
        const { nx, ny, nz, temperature, nextTemperature } = grid;
        const { thermalConductivity, density, specificHeat } = obj.material;
        
        const alpha = thermalConductivity / (density * specificHeat);

        const idx = (i: number, j: number, k: number) =>
            i + nx * (j + ny * k);

        for (let k = 1; k < nz - 1; k++) {
            for (let j = 1; j < ny - 1; j++) {
                for (let i = 1; i < nx - 1; i++) {
                    const id = idx(i, j, k);

                    const laplacian = 
                        temperature[idx(i + 1, j, k)] +
                        temperature[idx(i - 1, j, k)] +
                        temperature[idx(i, j + 1, k)] +
                        temperature[idx(i, j - 1, k)] +
                        temperature[idx(i, j, k + 1)] +
                        temperature[idx(i, j, k - 1)] -
                        6 * temperature[id];

                    nextTemperature[id] = 
                        temperature[id] + alpha * laplacian * dt;
                }
            }
        }
    }

    private swap(grid: HeatGrid) {
        const temp = grid.temperature;
        grid.temperature = grid.nextTemperature;
        grid.nextTemperature = temp;
    }
}