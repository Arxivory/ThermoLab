import type { HeatGrid } from "./HeatGrid";
import type { CompiledSimulation } from "../../types/CompiledSimulation";

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
        const cellVolume = dx * dy * dz;

        const idToK = new Float32Array(256).fill(0.026); 
        const idToPowerDensity = new Float32Array(256);

        for (const obj of sim.objects) {
            const internalIdx = ref.objectIdMap?.get(obj.id);
            if (internalIdx === undefined) continue;

            idToK[internalIdx] = obj.material.thermalConductivity;

            const source = sim.sources.find(s => s.objectId === obj.id);
            if (source) {
                const objGrid = grids.find(g => g.objectId === obj.id);
                let effectiveVoxelCount = 0;
                if (objGrid) {
                    for (let v of objGrid.volumeFraction) effectiveVoxelCount += v;
                }
                if (effectiveVoxelCount > 0) {
                    idToPowerDensity[internalIdx] = source.power / (effectiveVoxelCount * cellVolume);
                }
            }
        }

        for (let i = 0; i < nx * ny * nz; i++) {
            const gIdx = ref.globalNodeIndices[i];
            if (gIdx === -1) continue;

            let activeGrid = grids[0];
            let maxPhi = -1;
            for (const g of grids) {
                if (g.volumeFraction[i] > maxPhi) {
                    maxPhi = g.volumeFraction[i];
                    activeGrid = g;
                }
            }

            const selfObjIdx = activeGrid.objectIds![i];
            const k_self = idToK[selfObjIdx];
            const phi_self = activeGrid.volumeFraction[i];

            tempInitial[gIdx] = activeGrid.temperature[i];

            let isFixed = false;
            let fixedTemp = 293;
            for (const g of grids) {
                if (g.cellType[i] === 1) {
                    isFixed = true;
                    fixedTemp = g.temperature[i];
                    break;
                }
            }

            if (isFixed) {
                A[gIdx] = 1.0;
                B[gIdx] = fixedTemp;
                continue;
            }

            let selfCoeff = 0;
            const offsets = [
                { off: 1, distSq: dx * dx, arr: Kx, valid: (i % nx) < nx - 1 },
                { off: nx, distSq: dy * dy, arr: Ky, valid: Math.floor(i / nx) % ny < ny - 1 },
                { off: nx * ny, distSq: dz * dz, arr: Kz, valid: i < nx * ny * (nz - 1) }
            ];

            for (const n of offsets) {
                if (!n.valid) continue;
                const ni = i + n.off;
                const neighborGIdx = ref.globalNodeIndices[ni];
                if (neighborGIdx === -1) continue;

                const k_neighbor = idToK[ref.objectIds![ni]];
                const k_interface = (2 * k_self * k_neighbor) / (k_self + k_neighbor + 1e-6);
                const weight = (k_interface / n.distSq) * Math.min(phi_self, ref.volumeFraction[ni]);

                selfCoeff += weight;
                if (n.arr) n.arr[gIdx] = weight;
            }

            const backOffsets = [
                { off: -1, distSq: dx * dx, valid: (i % nx) > 0 },
                { off: -nx, distSq: dy * dy, valid: Math.floor(i / nx) % ny > 0 },
                { off: -nx * ny, distSq: dz * dz, valid: i >= nx * ny }
            ];

            for (const n of backOffsets) {
                if (!n.valid) continue;
                const ni = i + n.off;
                if (ref.globalNodeIndices[ni] === -1) continue;

                const k_neighbor = idToK[ref.objectIds![ni]];
                const k_interface = (2 * k_self * k_neighbor) / (k_self + k_neighbor + 1e-6);
                const weight = (k_interface / n.distSq) * Math.min(phi_self, ref.volumeFraction[ni]);
                selfCoeff += weight;
            }

            if (selfCoeff === 0) {
                A[gIdx] = 1.0;
                B[gIdx] = tempInitial[gIdx];
            } else {
                A[gIdx] = selfCoeff;
                B[gIdx] = idToPowerDensity[selfObjIdx] * phi_self;
            }
        }

        return { totalNodes, A, B, Kx, Ky, Kz, tempInitial };
    }

    private static mapGlobalIndices(grids: HeatGrid[]): number {
        let globalCounter = 0;
        const ref = grids[0];
        for (let i = 0; i < ref.volumeFraction.length; i++) {
            let hasVolume = false;
            for (const g of grids) {
                if (g.volumeFraction[i] > 0) {
                    hasVolume = true;
                    break;
                }
            }

            if (hasVolume) {
                ref.globalNodeIndices[i] = globalCounter++;
            } else {
                ref.globalNodeIndices[i] = -1;
            }
        }
        return globalCounter;
    }
}