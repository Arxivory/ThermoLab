import * as THREE from "three";

export interface HeatGrid {
    nx: number;
    ny: number;
    nz: number;

    dx: number;
    dy: number;
    dz: number;

    origin: THREE.Vector3;

    temperature: Float32Array;

    volumeFraction: Float32Array,
    globalNodeIndices: Int32Array,
    cellType: Uint32Array,

    objectId: string;
}