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
        const { nx, ny, nz } = ref;
        const unitScale = 0.001;
        const dx = ref.dx * unitScale;
        const dy = ref.dy * unitScale;
        const dz = ref.dz * unitScale;

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
                let sumPhi = 0;
                for (let v of objGrid.volumeFraction) sumPhi += v;
                if (sumPhi > 1e-9) {
                    idToPowerDensity[internalIdx] = (source.power / (sumPhi * cellVolume));
                }
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

            if (!activeGrid) { 
                A[i] = 1.0;
                B[i] = 293.0;
                continue; 
            }

            const selfObjIdx = activeGrid.objectIds![i];
            const k_self = idToK[selfObjIdx];
            const phi_self = activeGrid.volumeFraction[i];
            tempInitial[i] = activeGrid.temperature[i];

            let isFixed = false;
            for (const g of grids) {
                if (g.cellType[i] === 1 && g.volumeFraction[i] > 0) {
                    A[i] = 1.0;
                    B[i] = g.temperature[i];
                    isFixed = true;
                    break;
                }
            }
            if (isFixed) continue;

            let selfCoeff = 0;
            const neighbors = [
                { off: 1,       d2: dx*dx, arr: Kx, valid: (i % nx) < nx - 1 },
                { off: nx,      d2: dy*dy, arr: Ky, valid: (Math.floor(i/nx) % ny) < ny - 1 },
                { off: nx * ny, d2: dz*dz, arr: Kz, valid: i < nx*ny*(nz-1) },
                { off: -1,      d2: dx*dx, arr: null, valid: (i % nx) > 0 },
                { off: -nx,     d2: dy*dy, arr: null, valid: (Math.floor(i/nx) % ny) > 0 },
                { off: -nx * ny,d2: dz*dz, arr: null, valid: i >= nx*ny }
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

                const k_neighbor = neighborPhi > 0 ? idToK[neighborObjIdx] : 0.026;
                let k_int = (2 * k_self * k_neighbor) / (k_self + k_neighbor + 1e-9);

                if (neighborPhi > 0 && selfObjIdx !== neighborObjIdx)
                    k_int *= 0.1;

                const weight = (k_int / n.d2) * Math.min(phi_self, Math.max(0.001, neighborPhi));

                selfCoeff += weight;
                if (n.arr) n.arr[i] = weight; 
            }

            A[i] = Math.max(selfCoeff, 1e-4);
            B[i] = (idToPowerDensity[selfObjIdx] * phi_self);

            if (isFixed) {
                A[i] = 1.0;
                B[i] = activeGrid.temperature[i];
            }
        }

        return { totalNodes, A, B, Kx, Ky, Kz, tempInitial };
    }
}