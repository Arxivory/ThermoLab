import { SDFGenerator } from "./SDFGenerator";
import type { HeatGrid } from "../solvers/thermal/HeatGrid";
import * as THREE from "three";
import { MeshBVH } from "three-mesh-bvh";

export class MeshVoxelizer {
    static voxelizeMultiple(objects: any[], resolution: number = 20): HeatGrid[] {
        const globalBBox = new THREE.Box3();
        for (const obj of objects) {
            obj.mesh.updateMatrixWorld(true);
            const objBox = new THREE.Box3().setFromObject(obj.mesh);
            globalBBox.union(objBox);
        }

        const size = new THREE.Vector3();
        globalBBox.getSize(size);

        const paddingFactor = 0.1;
        const padding = size.clone().multiplyScalar(paddingFactor);

        const origin = globalBBox.min.clone().sub(padding);
        const totalSize = size.clone().add(padding.multiplyScalar(2));

        const maxDim = Math.max(totalSize.x, totalSize.y, totalSize.z);
        const nx = Math.max(Math.ceil(resolution * totalSize.x / maxDim), 1);
        const ny = Math.max(Math.ceil(resolution * totalSize.y / maxDim), 1);
        const nz = Math.max(Math.ceil(resolution * totalSize.z / maxDim), 1);

        const dx = totalSize.x / nx;
        const dy = totalSize.y / ny;
        const dz = totalSize.z / nz;

        const totalCells = nx * ny * nz;

        const unifiedGrid: HeatGrid = {
            nx, ny, nz,
            dx, dy, dz,
            origin,
            temperature: new Float32Array(totalCells).fill(293.15),
            volumeFraction: new Float32Array(totalCells),
            globalNodeIndices: new Int32Array(totalCells).fill(-1),
            cellType: new Uint32Array(totalCells).fill(0),
            objectIds: new Uint32Array(totalCells).fill(255),
            objectId: "unified",
            objectIdMap: new Map()
        };

        for (let objIdx = 0; objIdx < objects.length; objIdx++) {
            const obj = objects[objIdx];
            const mesh = obj.mesh;
            mesh.updateMatrixWorld(true);

            if (!mesh.geometry.boundsTree) {
                mesh.geometry.boundsTree = new MeshBVH(mesh.geometry);
            }

            unifiedGrid.objectIdMap!.set(obj.id, objIdx);
            console.log(`[MeshVoxelizer] Object ${objIdx}: "${obj.id}" -> internalIdx=${objIdx}`);

            const objectVolumeFractions = SDFGenerator.computeVolumeFractions(mesh, unifiedGrid);

            for (let i = 0; i < totalCells; i++) {
                const phi = objectVolumeFractions[i];
                if (phi > 0) {
                    unifiedGrid.volumeFraction[i] += phi;
                    if (phi > 0.5 || unifiedGrid.objectIds![i] === 255) {
                        unifiedGrid.objectIds![i] = objIdx;
                    }
                }
            }
        }

        console.log(`[MeshVoxelizer] Unified grid created: ${nx}x${ny}x${nz} = ${totalCells} cells`);
        const cellsPerObject = new Map<number, number>();
        for (let i = 0; i < totalCells; i++) {
            const objIdx = unifiedGrid.objectIds![i];
            if (objIdx !== 255) {
                cellsPerObject.set(objIdx, (cellsPerObject.get(objIdx) || 0) + 1);
            }
        }
        for (const [objIdx, count] of cellsPerObject) {
            const objId = Array.from(unifiedGrid.objectIdMap!.entries()).find(([_, idx]) => idx === objIdx)?.[0];
            console.log(`[MeshVoxelizer] Object idx=${objIdx} ("${objId}"): ${count} cells`);
        }

        const perObjectGrids: HeatGrid[] = objects.map((obj, objIdx) => {
            const grid: HeatGrid = {
                nx, ny, nz,
                dx, dy, dz,
                origin,
                temperature: unifiedGrid.temperature,
                volumeFraction: new Float32Array(totalCells),
                globalNodeIndices: unifiedGrid.globalNodeIndices,
                cellType: unifiedGrid.cellType,
                objectIds: unifiedGrid.objectIds,
                objectId: obj.id,
                objectIdMap: unifiedGrid.objectIdMap
            };

            for (let i = 0; i < totalCells; i++) {
                if (unifiedGrid.objectIds![i] === objIdx) {
                    grid.volumeFraction[i] = unifiedGrid.volumeFraction[i];
                }
            }

            return grid;
        });

        return perObjectGrids;
    }

    static voxelize(object: any, resolution: number = 20): HeatGrid {
        return this.voxelizeMultiple([object], resolution)[0];
    }
}