import { THERMAL_KERNELS_SRC } from './ThermalKernels';
import type { GlobalSystem } from '../solvers/thermal/MatrixAssembler';

export class ComputePipeline {
    private device: GPUDevice;
    private pipeline: GPUComputePipeline;
    
    private staticBindGroup: GPUBindGroup | null = null;
    private dynamicBindGroups: GPUBindGroup[] = [];
    
    private pingPongBuffers: GPUBuffer[] = [];
    private resultBuffer: GPUBuffer | null = null;
    private bufferSize: number = 0;
    
    private currentReadIndex = 0;

    constructor(device: GPUDevice) {
        this.device = device;
        const shaderModule = device.createShaderModule({ code: THERMAL_KERNELS_SRC });
        this.pipeline = device.createComputePipeline({
            layout: 'auto',
            compute: { module: shaderModule, entryPoint: 'main' },
        });
    }

    setup(system: GlobalSystem, nx: number, ny: number) {
        const { totalNodes, A, B, Kx, Ky, Kz, tempInitial } = system;
        this.bufferSize = totalNodes * 4;

        const bufA = this.createBuffer(A, GPUBufferUsage.STORAGE);
        const bufB = this.createBuffer(B, GPUBufferUsage.STORAGE);
        const bufKx = this.createBuffer(Kx, GPUBufferUsage.STORAGE);
        const bufKy = this.createBuffer(Ky, GPUBufferUsage.STORAGE);
        const bufKz = this.createBuffer(Kz, GPUBufferUsage.STORAGE);

        this.staticBindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: bufA } },
                { binding: 1, resource: { buffer: bufB } },
                { binding: 2, resource: { buffer: bufKx } },
                { binding: 3, resource: { buffer: bufKy } },
                { binding: 4, resource: { buffer: bufKz } },
            ]
        });

        const bufTemp1 = this.createBuffer(tempInitial, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST);
        const bufTemp2 = this.createBuffer(tempInitial, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST);
        this.pingPongBuffers = [bufTemp1, bufTemp2];

        const params = new Uint32Array([totalNodes, nx, nx * ny, 0]); 
        const bufParams = this.createBuffer(params, GPUBufferUsage.UNIFORM);

        this.dynamicBindGroups = [
            this.device.createBindGroup({ 
                layout: this.pipeline.getBindGroupLayout(1),
                entries: [
                    { binding: 0, resource: { buffer: bufTemp1 } },
                    { binding: 1, resource: { buffer: bufTemp2 } },
                    { binding: 2, resource: { buffer: bufParams } },
                ]
            }),
            this.device.createBindGroup({ 
                layout: this.pipeline.getBindGroupLayout(1),
                entries: [
                    { binding: 0, resource: { buffer: bufTemp2 } },
                    { binding: 1, resource: { buffer: bufTemp1 } },
                    { binding: 2, resource: { buffer: bufParams } },
                ]
            })
        ];

        this.resultBuffer = this.device.createBuffer({
            size: this.bufferSize,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
        });
        
        this.currentReadIndex = 0;
    }

    run(iterations: number, totalNodes: number) {
        const commandEncoder = this.device.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(this.pipeline);
        
        passEncoder.setBindGroup(0, this.staticBindGroup!);

        const workgroups = Math.ceil(totalNodes / 64);

        for (let i = 0; i < iterations; i++) {
            passEncoder.setBindGroup(1, this.dynamicBindGroups[this.currentReadIndex]);
            passEncoder.dispatchWorkgroups(workgroups);
            this.currentReadIndex = 1 - this.currentReadIndex;
        }

        passEncoder.end();
        this.device.queue.submit([commandEncoder.finish()]);
    }

    async getLatestTemperatures(): Promise<Float32Array> {
        const validBuffer = this.pingPongBuffers[this.currentReadIndex];

        const commandEncoder = this.device.createCommandEncoder();
        commandEncoder.copyBufferToBuffer(validBuffer, 0, this.resultBuffer!, 0, this.bufferSize);
        this.device.queue.submit([commandEncoder.finish()]);

        await this.resultBuffer!.mapAsync(GPUMapMode.READ);
        const result = new Float32Array(this.resultBuffer!.getMappedRange().slice(0));
        this.resultBuffer!.unmap();
        
        return result;
    }

    private createBuffer(data: ArrayBufferView, usage: number): GPUBuffer {
        const buffer = this.device.createBuffer({
            size: data.byteLength,
            usage: usage,
            mappedAtCreation: true
        });
        
        if (data instanceof Float32Array) {
            new Float32Array(buffer.getMappedRange()).set(data);
        } else if (data instanceof Uint32Array) {
            new Uint32Array(buffer.getMappedRange()).set(data);
        }
        
        buffer.unmap();
        return buffer;
    }
}