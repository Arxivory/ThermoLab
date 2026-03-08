import { MeshVoxelizer } from "../../geometry/MeshVoxelixer";
import { ComputePipeline } from "../../gpu/ComputePipeline";
import { GPUDeviceManager } from "../../gpu/GPUDeviceManager";
import type { CompiledSimulation } from "../../types/CompiledSimulation";
import { applyBoundaryConditions } from "./BoundaryHandlers";
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

        this.grids = MeshVoxelizer.voxelizeMultiple(simulation.objects, 20);
        
        const masterGrid = this.grids[0];

        this.applyBoundaryConditions(simulation);
        
        this.system = MatrixAssembler.assemble(this.grids, simulation);

        this.pipeline = new ComputePipeline(this.device);

        this.pipeline.setup(this.system, masterGrid.nx, masterGrid.ny);

        console.log(`Thermal Solver Initialized: ${this.system.totalNodes} overall nodes.`);
        console.log(`Unified grid: ${masterGrid.nx}x${masterGrid.ny}x${masterGrid.nz}`);
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

    private applyBoundaryConditionsLegacy(simulation: CompiledSimulation) {
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

    private applyBoundaryConditions(simulation: CompiledSimulation) {
        // Build unified volumeFraction FIRST
        const masterGrid = this.grids[0];
        const unifiedVolumeFraction = new Float32Array(masterGrid.temperature.length).fill(0);
        
        for (const grid of this.grids) {
            for (let i = 0; i < grid.volumeFraction.length; i++) {
                unifiedVolumeFraction[i] = Math.max(unifiedVolumeFraction[i], grid.volumeFraction[i]);
            }
        }

        for (const bc of simulation.boundaryConditions) {
            const grid = this.grids.find(g => g.objectId === bc.objectId);
            if (!grid) continue;

            if (bc.kind === "FIXED_TEMPERATURE") {
                const { nx, ny, nz } = grid;

                for (let i = 0; i < grid.volumeFraction.length; i++) {
                    if (grid.volumeFraction[i] <= 0) continue;

                    let shouldApply = false;

                    if (bc.applyTo === "VOLUME") {
                        shouldApply = true;
                    } else if (bc.applyTo === "SURFACE") {
                        // Check against UNIFIED grid, not per-object grid
                        shouldApply = this.isSurfaceCell(i, unifiedVolumeFraction, nx, ny, nz);
                    }

                    if (shouldApply) {
                        grid.cellType[i] = 1;
                    }
                }
            }
        }
    }

    private isSurfaceCell(i: number, unifiedVolumeFraction: Float32Array, nx: number, ny: number, nz: number): boolean {
        const x = i % nx;
        const y = Math.floor(i / nx) % ny;
        const z = Math.floor(i / (nx * ny));

        const neighbors = [
            { dx: 1, dy: 0, dz: 0 }, { dx: -1, dy: 0, dz: 0 },
            { dx: 0, dy: 1, dz: 0 }, { dx: 0, dy: -1, dz: 0 },
            { dx: 0, dy: 0, dz: 1 }, { dx: 0, dy: 0, dz: -1 }
        ];

        for (const n of neighbors) {
            const nx_ = x + n.dx;
            const ny_ = y + n.dy;
            const nz_ = z + n.dz;

            // At domain boundary
            if (nx_ < 0 || nx_ >= nx || ny_ < 0 || ny_ >= ny || nz_ < 0 || nz_ >= nz) {
                return true;
            }

            // Next to empty space (check unified grid)
            const ni = nx_ + nx * (ny_ + ny * nz_);
            if (unifiedVolumeFraction[ni] < 0.1) {
                return true;
            }
        }

        return false;
    }

    private mapResultsToGrids(results: Float32Array) {
        for (const grid of this.grids) {
            for (let i = 0; i < grid.volumeFraction.length; i++) {
                if (grid.volumeFraction[i] > 0) {
                    grid.temperature[i] = results[i];
                }
            }
        }
    }
    

}