import type { HeatGrid } from "./HeatGrid";
import type { CompiledSimulation } from "../../types/CompiledSimulation";

export function applyBoundaryConditions(
    grids: HeatGrid[], 
    simulation: CompiledSimulation
) {
    const masterGrid = grids[0];
    masterGrid.cellType.fill(0);

    for (const bc of simulation.boundaryConditions) {
        const targetGrid = grids.find(g => g.objectId === bc.objectId);
        if (!targetGrid) continue;

        if (bc.kind === "FIXED_TEMPERATURE") {
            applyFixedTemperature(
                masterGrid, 
                targetGrid, 
                bc.temperature, 
                bc.applyTo || "VOLUME"
            );
        }
    }
}

function applyFixedTemperature(
    master: HeatGrid, 
    target: HeatGrid, 
    T: number, 
    mode: "SURFACE" | "VOLUME"
) {
    const { nx, ny, nz } = master;

    for (let z = 0; z < nz; z++) {
        for (let y = 0; y < ny; y++) {
            for (let x = 0; x < nx; x++) {
                const i = x + nx * (y + ny * z);

                if (target.volumeFraction[i] <= 0) continue;

                let shouldApply = false;

                if (mode === "VOLUME") {
                    shouldApply = true;
                } else {
                    const neighbors = [
                        { dx: 1, dy: 0, dz: 0 }, { dx: -1, dy: 0, dz: 0 },
                        { dx: 0, dy: 1, dz: 0 }, { dx: 0, dy: -1, dz: 0 },
                        { dx: 0, dy: 0, dz: 1 }, { dx: 0, dy: 0, dz: -1 }
                    ];

                    for (const n of neighbors) {
                        const nx_ = x + n.dx; const ny_ = y + n.dy; const nz_ = z + n.dz;
                        if (nx_ < 0 || nx_ >= nx || ny_ < 0 || ny_ >= ny || nz_ < 0 || nz_ >= nz) {
                            shouldApply = true; break;
                        }

                        const ni = nx_ + nx * (ny_ + ny * nz_);
                        if (master.volumeFraction[ni] < 0.1) {
                            shouldApply = true; break;
                        }
                    }
                }

                if (shouldApply) {
                    master.temperature[i] = T;
                    master.cellType[i] = 1; 
                }
            }
        }
    }
}