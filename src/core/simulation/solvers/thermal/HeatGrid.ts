export interface HeatGrid {
    nx: number;
    ny: number;
    nz: number;

    dx: number;
    dy: number;
    dz: number;

    temperature: Float32Array;
    nextTemperature: Float32Array;
}