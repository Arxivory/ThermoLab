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
        const ref = grids[0];
        const { nx, ny, nz, dx, dy, dz } = ref;
        const totalNodes = nx * ny * nz;
        const cellVolume = dx * dy * dz;

        const A = new Float32Array(totalNodes).fill(1.0);
        const B = new Float32Array(totalNodes).fill(293.0);
        const Kx = new Float32Array(totalNodes).fill(0);
        const Ky = new Float32Array(totalNodes).fill(0);
        const Kz = new Float32Array(totalNodes).fill(0);
        const tempInitial = new Float32Array(totalNodes).fill(293.0);

        const idToK = new Float32Array(256).fill(0.026);
        const idToPowerDensity = new Float32Array(256).fill(0); 

        for (const obj of sim.objects) {
            const objGrid = grids.find(g => g.objectId === obj.id);
            if (!objGrid) continue;

            let internalIdx = -1;
            for(let k=0; k < objGrid.objectIds!.length; k++) {
                if (objGrid.volumeFraction[k] > 0) {
                    internalIdx = objGrid.objectIds![k];
                    break;
                }
            }
            if (internalIdx === -1) continue;

            idToK[internalIdx] = Math.max(0.001, obj.material.thermalConductivity);

            const source = sim.sources.find(s => s.objectId === obj.id);
            if (source && source.kind === "INTERNAL_HEAT") {
                // let sumPhi = 0;
                // for (let v of objGrid.volumeFraction) sumPhi += v;
                // if (sumPhi > 1e-9) {
                //     idToPowerDensity[internalIdx] = source.power / (sumPhi * cellVolume);
                // }
                console.log('yes it is internal');
                idToPowerDensity[internalIdx] = 10000.0;
            }
        }

        for (let i = 0; i < totalNodes; i++) {
            let activeGrid = null;
            for (const g of grids) {
                if (g.volumeFraction[i] > 0) {
                    activeGrid = g;
                    break;
                }
            }

            if (!activeGrid) continue;

            const selfObjIdx = activeGrid.objectIds![i];
            const k_self = idToK[selfObjIdx];
            const phi_self = activeGrid.volumeFraction[i];
            tempInitial[i] = activeGrid.temperature[i];

            let isFixed = false;
            for (const g of grids) {
                if (g.cellType[i] === 1 && g.volumeFraction[i] > 0) {
                    A[i] = -1.0;
                    B[i] = g.temperature[i];
                    isFixed = true;
                    break;
                }
            }
            if (isFixed) continue;

            let selfCoeff = 0;
            const neighbors = [
                { off: 1, arr: Kx, valid: (i % nx) < nx - 1, d2: dx*dx },
                { off: nx, arr: Ky, valid: (Math.floor(i/nx) % ny) < ny - 1, d2: dy*dy },
                { off: nx * ny, arr: Kz, valid: i < nx*ny*(nz-1), d2: dz*dz }
            ];

            for (const n of neighbors) {
                if (!n.valid) continue;
                const ni = i + n.off;
                
                let neighborPhi = 0;
                let neighborObjIdx = 0;
                for(const g of grids) {
                    if(g.volumeFraction[ni] > 0) {
                        neighborPhi = g.volumeFraction[ni];
                        neighborObjIdx = g.objectIds![ni];
                        break;
                    }
                }
                if (neighborPhi <= 0) continue;

                const k_neighbor = idToK[neighborObjIdx];
                const k_int = (2 * k_self * k_neighbor) / (k_self + k_neighbor + 1e-9);
                const weight = (k_int / n.d2) * Math.min(phi_self, neighborPhi);

                n.arr[i] = weight;
                selfCoeff += weight;
                A[ni] += weight; 
            }

            A[i] += selfCoeff;
            B[i] = (idToPowerDensity[selfObjIdx] * phi_self);
        }

        return { totalNodes, A, B, Kx, Ky, Kz, tempInitial };
    }

    private static mapGlobalIndices(grids: HeatGrid[]): number {
        return grids[0].nx * grids[0].ny * grids[0].nz;
    }
}