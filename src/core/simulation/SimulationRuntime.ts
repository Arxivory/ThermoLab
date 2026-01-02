import { MotionSolver } from "./solvers/MotionSolver";
import { ThermalSolver } from "./solvers/thermal/ThermalSolver";
import type { CompiledSimulation } from "./types/CompiledSimulation";
import { ThermalVisualizer } from "./visualization/ThermalVisualizer";

export class SimulationRuntime {
    private motionState;
    private thermalState;
    private simulation;

    constructor(sim: CompiledSimulation) {
        this.simulation = sim;
        this.motionState = MotionSolver.initialize(this.simulation);
        this.thermalState = ThermalSolver.initialize(this.simulation);
    }

    step(dt: number) {
        MotionSolver.apply(this.simulation, this.motionState, dt);
        ThermalSolver.apply(this.simulation, this.thermalState, dt);
        ThermalVisualizer.update(this.simulation, this.thermalState);
    }
}