import type { CompiledSimulation } from "../../types/CompiledSimulation";
import type { HeatGrid } from "./HeatGrid";
import * as THREE from "three";

const CONTACT_CONDUCTANCE = 5;

export class ThermalCoupling {
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

        const boxA = new THREE.Box3().setFromObject(objA.mesh);
        const boxB = new THREE.Box3().setFromObject(objB.mesh);

        if (!boxA.intersectsBox(boxB)) return;

        const matA = objA.material;
        const matB = objB.material;

        const V = A.dx * A.dy * A.dz;

        const idx = (i:number,j:number,k:number,nx:number,ny:number)=>
            i + nx*(j + ny*k);

        const gridToWorld = (grid: HeatGrid, i: number, j: number, k: number) => {
            return new THREE.Vector3(
                grid.origin.x + (i + 0.5) * grid.dx,
                grid.origin.y + (j + 0.5) * grid.dy,
                grid.origin.z + (k + 0.5) * grid.dz
            )
        }

        const worldToGrid = (grid: HeatGrid, pos: THREE.Vector3) => {
            const i = Math.floor((pos.x - grid.origin.x) / grid.dx);
            const j = Math.floor((pos.y - grid.origin.y) / grid.dy);
            const k = Math.floor((pos.z - grid.origin.z) / grid.dz);
            return { i, j, k };
        }

        for (let k = 0; k < A.nz; k++) {
            for (let j = 0; j < A.ny; j++) {
                for (let i = 0; i < A.nx; i++) {
                    const isBoundary =
                        i === 0 || i === A.nx - 1 ||
                        j === 0 || j === A.ny - 1 ||
                        k === 0 || k === A.nz - 1

                    if (!isBoundary) continue;

                    const worldPos = gridToWorld(A, i, j, k);

                    if (!boxB.containsPoint(worldPos)) continue;

                    const { i: iB, j: jB, k: kB} = worldToGrid(B, worldPos);

                    if (iB < 0 || iB >= B.nx ||
                        jB < 0 || jB >= B.ny ||
                        kB < 0 || kB >= B.nz
                    ) continue;

                    const idA = idx(i, j, k, A.nx, A.ny);
                    const idB = idx(iB, jB, kB, B.nx, B.ny);

                    const TA = A.temperature[idA];
                    const TB = B.temperature[idB];

                    const dQ = CONTACT_CONDUCTANCE * (TB - TA)

                    A.temperature[idA] += 
                        (dQ * dt) / (matA.density * matA.specificHeat * V);

                    A.temperature[idB] -=
                        (dQ * dt) / (matB.density * matB.specificHeat * V);
                }
            }
        }
    }

}