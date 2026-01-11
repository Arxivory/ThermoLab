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
    const { nx, ny, nz, nextTemperature } = grid;

    for (let i = 0; i < nx; i++) {
        for (let j = 0; j < ny; j++) {
            const id = i + nx * (j + ny * 0);
            nextTemperature[id] = T;
        }
    }

    //temperature.fill(T);
}