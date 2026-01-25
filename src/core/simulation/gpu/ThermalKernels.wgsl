@group(0) @binding(0) var<storage, read_write> temp : array<f32>;
@group(0) @binding(1) var<storage, read> volume : array<f32>;
@group(0) @binding(2) var<storage, read_write> nextTemp : array<f32>;

struct Params {
    nx: u32, ny: u32, nz: u32,
    cx: f32, cy: f32, cz: f32
}
@group(0) @binding(3) var<uniform> p : Params;

@compute @workgroup_size(8, 8, 8)
fn main(@builtin(global_invocation_id) id : vec3<u32>) {
    if (id.x >= p.nx || id.y >= p.ny || id.z >= p.nz) { return; }

    let idx = id.x + p.nx * (id.y + p.ny * id.z);
    let phi_self = volume[idx];

    var sumWeightedT = 0.0;
    var sumCoeffs = 0.0;

    if (id.x < p.nx - 1u) {
        let_nidx = (id.x + 1u) + p.nx * (id.y + p.ny * id.z);
        let aperture = min(phi_self, volume[n_idx]);
        sumWeightedT += p.cx * aperture * temp[n_idx];
        sumCoeffs += p.cx * aperture;
    }

}