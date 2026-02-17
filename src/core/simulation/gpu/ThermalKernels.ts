export const THERMAL_KERNELS_SRC = `
struct Params {
    total_nodes: u32,
    stride_y: u32,  
    stride_z: u32,  
    padding: u32,
};

@group(0) @binding(0) var<storage, read> A : array<f32>;
@group(0) @binding(1) var<storage, read> B : array<f32>;
@group(0) @binding(2) var<storage, read> Kx : array<f32>;  
@group(0) @binding(3) var<storage, read> Ky : array<f32>;
@group(0) @binding(4) var<storage, read> Kz : array<f32>;

@group(1) @binding(0) var<storage, read> temp_in : array<f32>;
@group(1) @binding(1) var<storage, read_write> temp_out : array<f32>;
@group(1) @binding(2) var<uniform> p : Params;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id : vec3<u32>) {
    let idx = id.x;
    if (idx >= p.total_nodes) { return; }

    let a_val = A[idx];

    if (a_val < 0.0) {
        temp_out[idx] = B[idx];
        return;
    }

    var sum_flux = 0.0;

    if ((idx % p.stride_y) < (p.stride_y - 1u)) {
        sum_flux += Kx[idx] * temp_in[idx + 1u];
    }
    if ((idx % p.stride_y) > 0u) {
        sum_flux += Kx[idx - 1u] * temp_in[idx - 1u];
    }

    if ((idx / p.stride_y % (p.stride_z / p.stride_y)) < (p.stride_z / p.stride_y - 1u)) {
        sum_flux += Ky[idx] * temp_in[idx + p.stride_y];
    }
    if (idx >= p.stride_y) {
        sum_flux += Ky[idx - p.stride_y] * temp_in[idx - p.stride_y];
    }

    if (idx + p.stride_z < p.total_nodes) {
        sum_flux += Kz[idx] * temp_in[idx + p.stride_z];
    }
    if (idx >= p.stride_z) {
        sum_flux += Kz[idx - p.stride_z] * temp_in[idx - p.stride_z];
    }

    temp_out[idx] = (sum_flux + B[idx]) / a_val;
}
`;