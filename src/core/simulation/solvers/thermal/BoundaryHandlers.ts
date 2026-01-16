import type { HeatGrid } from "./HeatGrid";
import type { CompiledSimulation } from "../../types/CompiledSimulation";

export function applyBoundaryConditions(
    objectId: string,
    grid: HeatGrid,
    simulation: CompiledSimulation
) {
    for (const bc of simulation.boundaryConditions) {
        if (bc.objectId !== objectId) continue;

        switch(bc.kind) {
            case "FIXED_TEMPERATURE":
                applyFixedTemperature(grid, bc.temperature);
        }
    }
}

function applyFixedTemperature(grid: HeatGrid, T: number) {
    const { nx, ny, nz, temperature } = grid;

    for (let i = 0; i < nx; i++) {
        for (let j = 0; j < ny; j++) {
            for (let k = 0; k < nz; k++) {
                if (i === 0 || i === nx - 1 ||
                    j === 0 || j === ny - 1 ||
                    k === 0 || k === nz - 1) {
                    const id = i + nx * (j + ny * k);
                    temperature[id] = T;
                }
            }
        }
    }

}