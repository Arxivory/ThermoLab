import type { CompiledSimulation } from "../../types/CompiledSimulation";
import type { HeatGrid } from "./HeatGrid";
import * as THREE from "three";

const CONTACT_DISTANCE = 1.5;
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

        const spacing = Math.max(A.dx, A.dy, A.dz);
        const V = spacing ** 3;

        const idx = (i:number,j:number,k:number,nx:number,ny:number)=>
            i + nx*(j + ny*k);

        for (let k = 0; k < A.nz; k++) {
            for (let j = 0; j < A.ny; j++) {
                for (let i = 0; i < A.nx; i++) {

                    if (
                        i !== 0 && j !== 0 && k !== 0 &&
                        i !== A.nx-1 && j !== A.ny-1 && k !== A.nz-1
                    ) continue;

                    const idA = idx(i,j,k,A.nx,A.ny);
                    const idB = idA % B.temperature.length;

                    const TA = A.temperature[idA];
                    const TB = B.temperature[idB];

                    const dQ = CONTACT_CONDUCTANCE * (TB - TA);

                    A.temperature[idA] +=
                        (dQ * dt) / (matA.density * matA.specificHeat * V);

                    B.temperature[idB] -=
                        (dQ * dt) / (matB.density * matB.specificHeat * V);
                }
            }
        }
    }

}