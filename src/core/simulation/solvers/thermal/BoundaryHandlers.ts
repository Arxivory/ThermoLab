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
            temperature[i + nx * j] = T;
            temperature[i + nx * (j + ny * (nz - 1))] = T;
        }
    }
}