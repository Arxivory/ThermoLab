export class GPUDeviceManager {
    private static device: GPUDevice | null = null;

    static async getDevice(): Promise<GPUDevice> {
        if (this.device) return this.device;

        if (!navigator.gpu) {
            throw new Error("WebGPU is not supported in this browser.");
        }

        const adapter = await navigator.gpu.requestAdapter({
            powerPreference: 'high-performance'
        });

        if (!adapter) {
            throw new Error("Failed to get GPU adapter.");
        }

        this.device = await adapter.requestDevice();

        this.device.lost.then((info) => {
            console.error(`GPU device lost: ${info.message}`);
            this.device = null;
        });

        return this.device;
    }
}