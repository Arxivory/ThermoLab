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
    nextTemperature: Float32Array;

    objectId: string;
}