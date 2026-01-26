import type { HeatGrid } from "../solvers/thermal/HeatGrid";

export class ComputePipeline {
    private device: GPUDevice;
    private pipeline: GPUComputePipeline;
    private bindGroups: GPUBindGroup[] =[];
    private buffers: { [key: string]: GPUBuffer } = {};
    private currentInIndex = 0;

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

        this.buffers.tempA = this.createBuffer(grid.temperature, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST);
        this.buffers.tempB = this.createBuffer(grid.temperature, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST);
        this.buffers.volume = this.createBuffer(grid.volumeFraction, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
        this.buffers.cellType = this.createBuffer(grid.cellType, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);

        const params = new Float32Array([grid.nx, grid.ny, grid.nz, grid.cx, grid.cy, grid.cz, 0]);
        this.buffers.params = this.createBuffer(params, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);

        this.bindGroups[0] = this.createBindGroup(this.buffers.tempA, this.buffers.tempB);
        this.bindGroups[1] = this.createBindGroup(this.buffers.tempB, this.buffers.tempA);
    }

    private createBindGroup(inBuf: GPUBuffer, outBuf: GPUBuffer) {
        return this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: inBuf } },
                { binding: 1, resource: { buffer: outBuf } },
                { binding: 2, resource: { buffer: this.buffers.volume } },
                { binding: 3, resource: { buffer: this.buffers.cellType } },
                { binding: 4, resource: { buffer: this.buffers.params } }
            ]
        })
    }

    private createBuffer(data: ArrayBufferView, usage: number) {
        const buffer = this.device.createBuffer({
            size: data.byteLength,
            usage: usage,
            mappedAtCreation: true
        });
        new (data.constructor as any)(buffer.getMappedRange()).set(data);
        buffer.unmap();
        return buffer;
    }

    run(iterations: number, nx: number, ny: number, nz: number) {
        const commandEncoder = this.device.createCommandEncoder();

        for (let i = 0; i < iterations; i++) {
            const passEncoder = commandEncoder.beginComputePass();
            passEncoder.setPipeline(this.pipeline);
            passEncoder.setBindGroup(0, this.bindGroups[this.currentInIndex]);
            passEncoder.dispatchWorkgroups(
                Math.ceil(nx / 8),
                Math.ceil(ny / 8),
                Math.ceil(nz / 8)
            );

            this.currentInIndex = 1 - this.currentInIndex;
        }

        this.device.queue.submit([commandEncoder.finish()]);
    }
}