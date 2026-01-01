import { MotionSolver } from "./solvers/MotionSolver";
import type { CompiledSimulation } from "./types/CompiledSimulation";

export class SimulationRuntime {
    private motionState;
    private simulation

    constructor(sim: CompiledSimulation) {
        this.simulation = sim;
        this.motionState = MotionSolver.initialize(this.simulation);
    }

    step(dt: number) {
        MotionSolver.apply(this.simulation, this.motionState, dt);
    }
}