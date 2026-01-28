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

        const inverseMatrix = mesh.matrixWorld.clone().invert();

        const subDiv = 3;
        const totalSamples = subDiv ** 3;
        const invSubDiv = 1.0 / subDiv;

        const worldPoint = new THREE.Vector3();
        const localPoint = new THREE.Vector3();

        for (let k = 0; k < nz; k++) {
            for (let j = 0; j < ny; j++) {
                for (let i = 0; i < nx; i++) {
                    let insideCount = 0;

                    for (let sz = 0; sz < subDiv; sz++) {
                        for (let sy = 0; sy < subDiv; sy++) {
                            for (let sx = 0; sx < subDiv; sx++) {
                                worldPoint.set(
                                    origin.x + (i + (sx + 0.5) * invSubDiv) * dx,
                                    origin.y + (j + (sy + 0.5) * invSubDiv) * dy,
                                    origin.z + (k + (sz + 0.5) * invSubDiv) * dz
                                );

                                localPoint.copy(worldPoint).applyMatrix4(inverseMatrix);
                                
                                if (this.isPointInside(localPoint, mesh)) {
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

    private static isPointInside(localPoint: THREE.Vector3, mesh: THREE.Mesh): boolean {
        const ray = new THREE.Ray(localPoint, new THREE.Vector3(0, 1, 0));
        let intersectionCount = 0;

        mesh.geometry.boundsTree!.shapecast({
            intersectsBounds: (box) => ray.intersectsBox(box),
            intersectsTriangle: (tri) => {
                if (ray.intersectTriangle(tri.a, tri.b, tri.c, false, new THREE.Vector3())) {
                    intersectionCount++;
                }
            }
        })

        return (intersectionCount % 2) !== 0;
    }
}