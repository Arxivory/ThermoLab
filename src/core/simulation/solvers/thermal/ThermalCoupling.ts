import type { CompiledObject, CompiledSimulation } from "../../types/CompiledSimulation";
import type { HeatGrid } from "./HeatGrid";
import * as THREE from "three";

const CONTACT_CONDUCTANCE = 1000;
const CONTACT_EPSILON = 50;

export class ThermalCoupling {
    private static _invMat = new THREE.Matrix4();
    private static _boxB = new THREE.Box3();

    static apply(
        simulation: CompiledSimulation,
        grids: Map<string, HeatGrid>,
        dt: number
    ) {
        const gridList = Array.from(grids.values());

        for (let a = 0; a < gridList.length; a++) {
            for (let b = a + 1; b < gridList.length; b++) {
                this.coupleGrids(
                    simulation,
                    gridList[a],
                    gridList[b],
                    dt
                )
            }
        }
    }

    private static coupleGrids(
        simulation: CompiledSimulation,
        A: HeatGrid,
        B: HeatGrid,
        dt: number
    ) {
        const objA = simulation.objects.find(o => o.id === A.objectId);
        const objB = simulation.objects.find(o => o.id === B.objectId);
        if (!objA || !objB) return;

        const worldBoxA = new THREE.Box3().setFromObject(objA.mesh);
        const worldBoxB = new THREE.Box3().setFromObject(objB.mesh);
        if (!worldBoxA.intersectsBox(worldBoxB)) return;

        this._invMat.copy(objB.mesh.matrixWorld).invert();

        if (!objB.mesh.geometry.boundingBox) objB.mesh.geometry.computeBoundingBox();
        this._boxB.copy(objB.mesh.geometry.boundingBox!);
            
        const V = A.dx * A.dy * A.dz

        const paddedBoxB = this._boxB.clone().expandByScalar(A.dx * CONTACT_EPSILON);

        for (let k = 0; k < A.nz; k++) {
            for (let j = 0; j < A.ny; j++) {
                for (let i = 0; i < A.nx; i++) {
                    if (i > 0 && i < A.nx - 1 && 
                        j > 0 && j < A.ny - 1 && 
                        k > 0 && k < A.nz - 1) continue;
                    
                    const worldPosA = this.getVoxelWorldPos(objA, A, i, j, k);

                    const localPosB = worldPosA.applyMatrix4(this._invMat);

                    if (paddedBoxB.containsPoint(localPosB)) {
                        const coordsB = this.localToGridIndices(localPosB, this._boxB, B);

                        const idA = i + A.nx * (j + A.ny * k);
                        const idB = coordsB.i + B.nx * (coordsB.j + B.ny * coordsB.k);

                        const TA = A.temperature[idA];
                        const TB = B.temperature[idB];

                        const dQ = CONTACT_CONDUCTANCE * (TB - TA);

                        A.nextTemperature[idA] += (dQ * dt) / (objA.material.density * objA.material.specificHeat * V);
                        B.nextTemperature[idB] -= (dQ * dt) / (objB.material.density * objB.material.specificHeat * V);
                    }
                    
                }
            }
        }
    }

    private static getVoxelWorldPos(
        obj: CompiledObject,
        grid: HeatGrid,
        i: number, j: number, k: number
    ) {
        const localX = (i + 0.5) * grid.dx;
        const localY = (j + 0.5) * grid.dy;
        const localZ = (k + 0.5) * grid.dz;

        return new THREE.Vector3(localX, localY, localZ)
            .add(grid.origin)
            .applyMatrix4(obj.mesh.matrixWorld);
    }

    private static localToGridIndices(
        localPos: THREE.Vector3,
        localBox: THREE.Box3,
        grid: HeatGrid
    ) {
        const size = new THREE.Vector3();
        localBox.getSize(size);

        const u = (localPos.x - localBox.min.x) / size.x;
        const v = (localPos.y - localBox.min.y) / size.y;
        const w = (localPos.z - localBox.min.z) / size.z;

        return {
            i: Math.max(0, Math.min(grid.nx - 1, Math.floor(u * grid.nx))),
            j: Math.max(0, Math.min(grid.ny - 1, Math.floor(v * grid.ny))),
            k: Math.max(0, Math.min(grid.nz - 1, Math.floor(w * grid.nz)))
        };
    }

}