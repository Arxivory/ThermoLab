import type { HeatGrid } from './HeatGrid';
import type { CompiledSimulation } from '../../types/CompiledSimulation';

export interface GlobalSystem {
    totalNodes: number;
    A: Float32Array;
    B: Float32Array;        
    Kx: Float32Array;
    Ky: Float32Array;
    Kz: Float32Array;
    tempInitial: Float32Array;
}

export class MatrixAssembler {
    static assemble(grids: HeatGrid[], sim: CompiledSimulation): GlobalSystem {
        const totalNodes = this.mapGlobalIndices(grids);
        
        const A = new Float32Array(totalNodes);
        const B = new Float32Array(totalNodes);
        const Kx = new Float32Array(totalNodes);
        const Ky = new Float32Array(totalNodes);
        const Kz = new Float32Array(totalNodes);
        const tempInitial = new Float32Array(totalNodes);

        for (const grid of grids) {
            const obj = sim.objects.find(o => o.id === grid.objectId);
            if (!obj) continue;

            const { nx, ny, nz, dx, dy, dz, volumeFraction, globalNodeIndices, cellType, temperature } = grid;
            const k = obj.material.thermalConductivity;

            const cx = k / (dx * dx);
            const cy = k / (dy * dy);
            const cz = k / (dz * dz);

            for (let z = 0; z < nz; z++) {
                for (let y = 0; y < ny; y++) {
                    for (let x = 0; x < nx; x++) {
                        const localIdx = x + nx * (y + ny * z);
                        const gIdx = globalNodeIndices[localIdx];

                        if (gIdx === -1) continue;

                        const phi_self = volumeFraction[localIdx];
                        tempInitial[gIdx] = temperature[localIdx];

                        if (cellType[localIdx] === 1) {
                            A[gIdx] = 1.0;
                            B[gIdx] = temperature[localIdx];
                            continue;
                        }

                        let selfCoeff = 0;

                        if (x < nx - 1) {
                            const nIdx = (x + 1) + nx * (y + ny * z);
                            const weight = cx * Math.min(phi_self, volumeFraction[nIdx]);
                            Kx[gIdx] = weight;
                            selfCoeff += weight;
                        }
                        if (x > 0) {
                            const nIdx = (x - 1) + nx * (y + ny * z);
                            selfCoeff += cx * Math.min(phi_self, volumeFraction[nIdx]);
                        }

                        if (y < ny - 1) {
                            const nIdx = x + nx * ((y + 1) + ny * z);
                            const weight = cy * Math.min(phi_self, volumeFraction[nIdx]);
                            Ky[gIdx] = weight;
                            selfCoeff += weight;
                        }
                        if (y > 0) {
                            const nIdx = x + nx * ((y - 1) + ny * z);
                            selfCoeff += cy * Math.min(phi_self, volumeFraction[nIdx]);
                        }

                        if (z < nz - 1) {
                            const nIdx = x + nx * (y + ny * (z + 1));
                            const weight = cz * Math.min(phi_self, volumeFraction[nIdx]);
                            Kz[gIdx] = weight;
                            selfCoeff += weight;
                        }
                        if (z > 0) {
                            const nIdx = x + nx * (y + ny * (z - 1));
                            selfCoeff += cz * Math.min(phi_self, volumeFraction[nIdx]);
                        }

                        A[gIdx] = selfCoeff;
                        
                        const source = sim.sources.find(s => s.objectId === grid.objectId);
                        if (source) {
                            B[gIdx] = source.power / (dx * dy * dz * totalNodes); 
                        }
                    }
                }
            }
        }

        return { totalNodes, A, B, Kx, Ky, Kz, tempInitial };
    }

    private static mapGlobalIndices(grids: HeatGrid[]): number {
        let globalCounter = 0;
        for (const grid of grids) {
            for (let i = 0; i < grid.volumeFraction.length; i++) {
                if (grid.volumeFraction[i] > 0) {
                    grid.globalNodeIndices[i] = globalCounter++;
                } else {
                    grid.globalNodeIndices[i] = -1;
                }
            }
        }
        return globalCounter;
    }
}