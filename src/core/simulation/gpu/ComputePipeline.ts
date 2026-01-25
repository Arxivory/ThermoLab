import type { HeatGrid } from "../solvers/thermal/HeatGrid";

export class ComputePipeline {
    private device: GPUDevice;
    private pipeline: GPUComputePipeline;
    private temperatureBuffer: GPUBuffer;
    private volumeBuffer: GPUBuffer;

    constructor(device: GPUDevice, shaderSource: string) {
        this.device = device;

        this.pipeline = device.createComputePipeline({
            layout: 'auto',
            compute: {
                module: device.createShaderModule({ code: shaderSource }),
                entryPoint: 'main'
            }
        });
    }

    setupBuffers(grid: HeatGrid) {
        const size = grid.temperature.byteLength;

        this.temperatureBuffer = this.device.createBuffer({
            size,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
        });

        this.volumeBuffer = this.device.createBuffer({
            size,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        this.device.queue.writeBuffer(this.temperatureBuffer, 0, grid.temperature.buffer);
        this.device.queue.writeBuffer(this.volumeBuffer, 0, grid.volumeFraction.buffer);
    }

    run(nx: number, ny: number, nz: number) {
        const commandEncoder = this.device.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();

        passEncoder.setPipeline(this.pipeline);

        passEncoder.dispatchWorkgroups(
            Math.ceil(nx / 8),
            Math.ceil(ny / 8),
            Math.ceil(nz / 8),
        )

        passEncoder.end();
        this.device.queue.submit([commandEncoder.finish()]);
    }
}