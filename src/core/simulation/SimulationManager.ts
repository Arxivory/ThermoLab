import { SimulationCompiler } from "./SimulationCompiler";
import { SimulationRuntime } from "./SimulationRuntime";
import type { EditorState } from "../../store/editorStore";

export class SimulationManager {
    private runtime: SimulationRuntime | null = null;
    private lastTime = 0;
    private running = false;

    async solve(editorState: EditorState) {
        const compiled = SimulationCompiler.compile(editorState);
        this.runtime = new SimulationRuntime();
        await this.runtime.setup(compiled);
        this.runtime.runSteadyState(5000);
    }

    start(editorState: EditorState) {
        const compiled = SimulationCompiler.compile(editorState);
        this.runtime = new SimulationRuntime();
        this.runtime.setup(compiled);
        this.running = true;
        this.lastTime = performance.now();
        this.loop();
    }

    stop() {
        this.running = false;
        this.runtime = null;
    }

    private loop = () => {
        if (!this.running || !this.runtime) return;

        const now = performance.now();
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;

        //this.runtime.step(dt);

        requestAnimationFrame(this.loop);
    }

    isRunning() {
        return this.running;
    }
}