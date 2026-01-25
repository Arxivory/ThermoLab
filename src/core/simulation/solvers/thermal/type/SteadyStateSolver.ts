import type { HeatGrid } from "../HeatGrid";
import type { CompiledSimulation } from "../../../types/CompiledSimulation";

export class SteadyStateSolver {
    private static MAX_ITERATIONS = 1000;
    private static CONVERGENCE_THRESHOLD = 0.001;

    static solve(simulation: CompiledSimulation, grids: HeatGrid[]) {
        for (let iter = 0; iter < this.MAX_ITERATIONS; iter++) {
            let maxChange = 0;

            for (const grid of grids) {
                const { nx, ny, nz, dx, dy, dz, temperature, volumeFraction } = grid;
                const k = simulation.objects.find(o => o.id === grid.objectId)?.material.thermalConductivity || 1;

                const cx = k / (dx * dx);
                const cy = k / (dy * dy);
                const cz = k / (dz * dz);

                for (let k_idx = 1; k_idx < nz - 1; k_idx++) {
                    for (let j = 1; j < ny - 1; j++) {
                        for (let i = 1; i < nx - 1; i++) {
                            const id = i + nx * (j + ny * k_idx);
                            const phi_self = volumeFraction[id];

                            if (phi_self <= 0) continue;

                            const oldT = temperature[id];

                            const t_next = this.

                        }
                    }
                }

            }
        }
    }

    private static calculateNodeEquilibrium(
        i: number, j: number, k: number,
        grid: HeatGrid, 
        cx: number, cy: number, cz: number
    ): number {
        const { nx, ny, temperature, volumeFraction } = grid;

        const idx = (x: number, y: number, z: number) => x + nx * (y + ny * z);

        const id = idx(i, j, k);

        const neighbors = [
            { id: idx(i + 1, j, k), coeff: cx },
            { id: idx(i - 1, j, k), coeff: cx },
            { id: idx(i, j + 1, k), coeff: cy },
            { id: idx(i, j - 1, k), coeff: cy },
            { id: idx(i, j, k + 1), coeff: cz },
            { id: idx(i, j, k - 1), coeff: cz }
        ];

        let sumWeightedT = 0;
        let sumCoeffs = 0;

        for (const n of neighbors) {
            const aperture = Math.min(volumeFraction[id], volumeFraction[n.id]);

            if (aperture > 0) {
                sumWeightedT += n.coeff * aperture * temperature[n.id];
                sumCoeffs += n.coeff * aperture;
            }
        }

        return sumCoeffs > 0 ? sumWeightedT / sumCoeffs : temperature[id];
    }
}