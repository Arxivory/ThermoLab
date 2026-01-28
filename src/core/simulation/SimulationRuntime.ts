import { MotionSolver } from "./solvers/MotionSolver";
import type { HeatGrid } from "./solvers/thermal/HeatGrid";
import { ThermalSolver } from "./solvers/thermal/ThermalSolver";
import type { CompiledSimulation } from "./types/CompiledSimulation";
import { ThermalVisualizer } from "./visualization/ThermalVisualizer";

export class SimulationRuntime {
    private thermalSolver: ThermalSolver;
    private currentSimulation: CompiledSimulation | null = null;
    private isInitialized: boolean = false;

    public onProgress: (iteration: number) => void = () => {};
    public onComplete: (grids: HeatGrid[]) => void = () => {};

    constructor() {
        this.thermalSolver = new ThermalSolver();
    }

    async setup(simulation: CompiledSimulation): Promise<HeatGrid[]> {
        this.currentSimulation = simulation;

        console.log("Runtime: Starting Discretization and Matrix Assembly...");

        const grids = await this.thermalSolver.initialize(simulation);

        this.isInitialized = true;
        return grids;
    }

    async runSteadyState(iterations: number = 1000) {
        if (!this.isInitialized || !this.currentSimulation) {
            throw new Error("Runtime Error: Simulation not initialized. Call setup() first.");
        }

        console.log(`Runtime: Executing ${iterations} Jacobi Iterations on GPU...`);

        const startTime = performance.now();
        const results = await this.thermalSolver.solveSteadyState(iterations);
        const endTime = performance.now();

        console.log(`Runtime: Simulation Complete in ${(endTime - startTime).toFixed(2)} ms.`);

        this.onComplete(results);

        ThermalVisualizer.update(this.currentSimulation, results);

        return results;
    }

    resetTemperatures() {
        if (!this.isInitialized) return;

        console.log("Runtime: Resetting Temperature to Initial Conditions.");
    }
}