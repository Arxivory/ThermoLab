import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';
import type { HeatGrid } from '../solvers/thermal/HeatGrid';

export class SDFGenerator {
    static computeVolumeFractions(mesh: THREE.Mesh, grid: HeatGrid): Float32Array {
        const { nx, ny, nz, dx, dy, dz, origin } = grid;
        const fractions = new Float32Array(nx * ny * nz);

        if (!mesh.geometry.boundsTree) {
            mesh.geometry.boundsTree = new MeshBVH(mesh.geometry);
        }

        const subDiv = 3;
        const totalSamples = subDiv ** 3;
        const invSubDiv = 1.0 / subDiv;

        for (let k = 0; k < nz; k++) {
            for (let j = 0; j < ny; j++) {
                for (let i = 0; i < nx; i++) {
                    let insideCount = 0;

                    for (let sz = 0; sz < subDiv; sz++) {
                        for (let sy = 0; sy < subDiv; sy++) {
                            for (let sx = 0; sx < subDiv; sx++) {
                                const x = origin.x + (i + (sx + 0.5) * invSubDiv) * dx;
                                const y = origin.y + (j + (sy + 0.5) * invSubDiv) * dy;
                                const z = origin.z + (k + (sz + 0.5) * invSubDiv) * dz;

                                if (this.isPointInside(new THREE.Vector3(x, y, z), mesh)) {
                                    insideCount++;
                                }
                            }
                        }
                    }
                    fractions[i + nx * (j + ny * k)] = insideCount / totalSamples;
                }
            }
        }

        return fractions;
    }

    private static isPointInside(point: THREE.Vector3, mesh: THREE.Mesh): boolean {
        const raycaster = new THREE.Raycaster();

        const dir = new THREE.Vector3(0, 1, 0);
        raycaster.set(point, dir);

        const intersects = mesh.geometry.boundsTree!.raycastFirst(raycaster.ray, mesh);

        if (!intersects) return false;
        return dir.dot(intersects.face!.normal) > 0;
    }
}