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

        const ref = grids[0];
        const { nx, ny, nz, dx, dy, dz } = ref;

        const idToK = new Float32Array(256); 
        const idToPowerDensity = new Float32Array(256); 

        for (const [objId, internalIdx] of ref.objectIdMap!) {
            const obj = sim.objects.find(o => o.id === objId);
            const source = sim.sources.find(s => s.objectId === objId);
            
            if (obj) {
                idToK[internalIdx] = obj.material.thermalConductivity;
                
                if (source) {
                    let objNodeCount = 0;
                    for (let i = 0; i < ref.objectIds!.length; i++) {
                        if (ref.objectIds![i] === internalIdx && ref.volumeFraction[i] > 0) objNodeCount++;
                    }
                    idToPowerDensity[internalIdx] = source.power / (dx * dy * dz * objNodeCount);
                }
            }
        }

        for (let z = 0; z < nz; z++) {
            for (let y = 0; y < ny; y++) {
                for (let x = 0; x < nx; x++) {
                    const i = x + nx * (y + ny * z);
                    const gIdx = ref.globalNodeIndices[i];
                    if (gIdx === -1) continue;

                    const selfObjIdx = ref.objectIds![i];
                    const k_self = idToK[selfObjIdx];
                    const phi_self = ref.volumeFraction[i];

                    tempInitial[gIdx] = ref.temperature[i];

                    if (ref.cellType[i] === 1) {
                        A[gIdx] = 1.0;
                        B[gIdx] = ref.temperature[i];
                        continue;
                    }

                    let selfCoeff = 0;

                    const neighbors = [
                        { off: 1,           distSq: dx*dx, arr: Kx, active: x < nx - 1 },
                        { off: nx,          distSq: dy*dy, arr: Ky, active: y < ny - 1 },
                        { off: nx * ny,     distSq: dz*dz, arr: Kz, active: z < nz - 1 },
                        { off: -1,          distSq: dx*dx, arr: null, active: x > 0 },
                        { off: -nx,         distSq: dy*dy, arr: null, active: y > 0 },
                        { off: -nx * ny,    distSq: dz*dz, arr: null, active: z > 0 }
                    ];

                    for (const n of neighbors) {
                        if (!n.active) continue;
                        const ni = i + n.off;
                        const nPhi = ref.volumeFraction[ni];
                        
                        if (nPhi > 0) {
                            const k_neighbor = idToK[ref.objectIds![ni]];
                            
                            const k_interface = (2 * k_self * k_neighbor) / (k_self + k_neighbor + 1e-10);
                            const weight = (k_interface / n.distSq) * Math.min(phi_self, nPhi);
                            
                            selfCoeff += weight;
                            if (n.arr) n.arr[gIdx] = weight;
                        }
                    }

                    A[gIdx] = selfCoeff;
                    B[gIdx] = idToPowerDensity[selfObjIdx]; 
                }
            }
        }
        return { totalNodes, A, B, Kx, Ky, Kz, tempInitial };
    }

    private static mapGlobalIndices(grids: HeatGrid[]): number {
        let globalCounter = 0;
        const referenceGrid = grids[0];
        const { volumeFraction, globalNodeIndices } = referenceGrid;

        for (let i = 0; i < volumeFraction.length; i++) {
            if (volumeFraction[i] > 0) {
                globalNodeIndices[i] = globalCounter++;
            } else {
                globalNodeIndices[i] = -1;
            }
        }
        return globalCounter;
    }
}