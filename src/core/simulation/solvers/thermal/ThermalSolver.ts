import { MeshVoxelizer } from "../../geometry/MeshVoxelixer";
import { ComputePipeline } from "../../gpu/ComputePipeline";
import { GPUDeviceManager } from "../../gpu/GPUDeviceManager";
import type { CompiledSimulation } from "../../types/CompiledSimulation";
import type { HeatGrid } from "./HeatGrid";
import { MatrixAssembler, type GlobalSystem } from "./MatrixAssembler";

export interface ThermalState {
    grids: Map<string, HeatGrid>;
}

export class ThermalSolver {
    private pipeline: ComputePipeline | null = null;
    private system: GlobalSystem | null = null;
    private grids: HeatGrid[] = [];
    private device: GPUDevice | null = null;

    async initialize(simulation: CompiledSimulation) {
        this.device = await GPUDeviceManager.getDevice();

        this.grids = simulation.objects.map(obj => MeshVoxelizer.voxelize(obj, 20));

        this.applyBoundaryConditions(simulation);
        
        this.system = MatrixAssembler.assemble(this.grids, simulation);

        this.pipeline = new ComputePipeline(this.device);

        const masterGrid = this.grids[0];
        this.pipeline.setup(this.system, masterGrid.nx, masterGrid.ny);

        console.log(`Thermal Solver Initialized: ${this.system.totalNodes} overall nodes.`);
        return this.grids;
    }

    async solveSteadyState(iterations: number = 1000) {
        if (!this.pipeline || !this.system) {
            throw new Error("Solver not initialized. Call initialize() first.");
        }

        this.pipeline.run(iterations, this.system.totalNodes);

        const results = await this.pipeline.getLatestTemperatures();

        this.mapResultsToGrids(results);

        return this.grids;
    }

    private applyBoundaryConditions(simulation: CompiledSimulation) {
        for (const bc of simulation.boundaryConditions) {
            const grid = this.grids.find(g => g.objectId === bc.objectId);
            if (!grid) continue;

            if (bc.kind === "FIXED_TEMPERATURE") {
                for (let i = 0; i < grid.volumeFraction.length; i++) {
                    if (grid.volumeFraction[i] > 0) {
                        grid.cellType[i] = 1;
                        grid.temperature[i] = bc.temperature;
                    }
                }
            }
        }
    }

    private mapResultsToGrids(results: Float32Array) {
        for (const grid of this.grids) {
            for (let i = 0; i < grid.volumeFraction.length; i++) {
                const gIdx = grid.globalNodeIndices[i];
                if (gIdx !== 1) {
                    grid.temperature[i] = results[gIdx];
                }
            }
        }
    }
    

}