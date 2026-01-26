struct Params {
    nx: u32,
    ny: u32,
    nz: u32,
    cx: f32, 
    cy: f32, 
    cz: f32, 
    dt: f32
};

@group(0) @binding(0) var<storage, read> temp_in : array<f32>;
@group(0) @binding(1) var<storage, read_write> temp_out : array<f32>;
@group(0) @binding(2) var<storage, read> volume : array<f32>;
@group(0) @binding(3) var<storage, read> cell_type : array<u32>;
@group(0) @binding(4) var<uniform> p : Params;

@compute @workgroup_size(8, 8, 8)
fn main(@builtin(global_invocation_id) id : vec3<u32>) {
    if (id.x >= p.nx || id.y >= p.ny || id.z >= p.nz) { return; }
    
    let idx = id.x + p.nx * (id.y + p.ny * id.z);

    if (cell_type[idx] == 1u) {
        temp_out[idx] = temp_in[idx];
        return;
    }

    let phi_self = volume[idx];
    if (phi_self <= 0.0) { 
        temp_out[idx] = temp_in[idx];
        return; 
    }

    var sumWeightedT = 0.0;
    var sumCoeffs = 0.0;

    if (id.x > 0u) {
        let n_idx = (id.x - 1u) + p.nx * (id.y + p.ny * id.z);
        let weight = p.cx * min(phi_self, volume[n_idx]);
        sumWeightedT += weight * temp_in[n_idx];
        sumCoeffs += weight;
    }
    if (id.x < p.nx - 1u) {
        let n_idx = (id.x + 1u) + p.nx * (id.y + p.ny * id.z);
        let weight = p.cx * min(phi_self, volume[n_idx]);
        sumWeightedT += weight * temp_in[n_idx];
        sumCoeffs += weight;
    }

    if (id.y > 0u) {
        let n_idx = id.x + p.nx * ((id.y - 1u) + p.ny * id.z);
        let weight = p.cy * min(phi_self, volume[n_idx]);
        sumWeightedT += weight * temp_in[n_idx];
        sumCoeffs += weight;
    }
    if (id.y < p.ny - 1u) {
        let n_idx = id.x + p.nx * ((id.y + 1u) + p.ny * id.z);
        let weight = p.cy * min(phi_self, volume[n_idx]);
        sumWeightedT += weight * temp_in[n_idx];
        sumCoeffs += weight;
    }

    if (id.z > 0u) {
        let n_idx = id.x + p.nx * (id.y + p.ny * (id.z - 1u));
        let weight = p.cz * min(phi_self, volume[n_idx]);
        sumWeightedT += weight * temp_in[n_idx];
        sumCoeffs += weight;
    }
    if (id.z < p.nz - 1u) {
        let n_idx = id.x + p.nx * (id.y + p.ny * (id.z + 1u));
        let weight = p.cz * min(phi_self, volume[n_idx]);
        sumWeightedT += weight * temp_in[n_idx];
        sumCoeffs += weight;
    }

    if (sumCoeffs > 0.0) {
        temp_out[idx] = sumWeightedT / sumCoeffs;
    } else {
        temp_out[idx] = temp_in[idx];
    }
}