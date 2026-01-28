import { SDFGenerator } from "./SDFGenerator";
import type { HeatGrid } from "../solvers/thermal/HeatGrid";
import * as THREE from "three";

export class MeshVoxelizer {
    static voxelize(object: any, resolution: number = 20): HeatGrid {
        const mesh = object.mesh;

        mesh.updateMatrixWorld(true);
        const bbox = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        bbox.getSize(size);

        const paddingFactor = 0.1;
        const padding = size.clone().multiplyScalar(paddingFactor);

        const origin = bbox.min.clone().sub(padding);
        const totalSize = size.clone().add(padding.multiplyScalar(2));

        const nx = resolution;
        const ny = resolution;
        const nz = resolution;

        const dx = totalSize.x / nx;
        const dy = totalSize.y / ny;
        const dz = totalSize.z / nz;

        const grid: HeatGrid = {
            nx, ny, nz,
            dx, dy, dz,
            origin,
            temperature: new Float32Array(nx * ny * nz).fill(293.15),
            volumeFraction: new Float32Array(nx * ny * nz),
            globalNodeIndices: new Int32Array(nx * ny * nz).fill(-1),
            cellType: new Uint32Array(nx * ny * nz).fill(0),
            objectId: object.id
        };

        grid.volumeFraction = SDFGenerator.computeVolumeFractions(mesh, grid);

        return grid;
    }
}