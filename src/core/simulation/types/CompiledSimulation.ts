import type { SceneObject } from "../../../types/SceneObject";
import type { PhysicsToolInstance } from "../tools";
import * as THREE from "three"

export interface CompiledSimulation {
    metadata: {
        objectCount: number;
        toolCount: number;
    };

    objects: CompiledObject[];
    boundaryConditions: BoundaryCondition[];
    sources: SourceTerm[];
    motions: MotionConstraint[];
}

export interface CompiledObject {
    id: string;

    mesh: THREE.Object3D;
    transformMatrix: Float32Array;

    material: {
        density: number;
        specificHeat: number;
        thermalConductivity: number;
        emissivity: number;
        absorptivity: number;
    };
}

export type BoundaryCondition = 
    | FixedTemperatureBC
    | HeatFluxBC
    | ConvectionBC
    | RadiationBC
    | InsulationBC;

export interface FixedTemperatureBC {
    kind: "FIXED_TEMPERATURE";
    objectId: string;
    temperature: number;
    applyTo: "SURFACE" | "VOLUME";
}

export interface HeatFluxBC {
    kind: "HEAT_FLUX";
    objectId: string;
    flux: number;
    direction: "IN" | "OUT";
}

export interface ConvectionBC {
    kind: "CONVECTION";
    objectId: string
    heatTransferCoefficient: number;
    ambientTemperature: number;
}

export interface RadiationBC {
    kind: "RADIATION"
    objectId: string;
    environmentTemperature: number;
    viewFactor?: number;
}

export interface InsulationBC {
    kind: "INSULATION"
    objectId: string;
}

export interface InternalHeatSource {
    kind: "INTERNAL_HEAT";
    objectId: string;
    power: number;
    distribution: "UNIFORM" | "RADIAL";
    radius?: number;
}

export type SourceTerm = InternalHeatSource;

export type MotionConstraint =
    | AngularVelocityConstraint
    | LinearVelocityConstraint;

export interface AngularVelocityConstraint {
    kind: "ANGULAR_VELOCITY";
    objectId: string;
    omega: {
        x: number;
        y: number;
        z: number;
    }
    space: "LOCAL" | "WORLD"
}

export interface LinearVelocityConstraint {
    kind: "LINEAR_VELOCITY";
    objectId: string;
    velocity: {
        x: number;
        y: number;
        z: number;
    }
    space: "LOCAL" | "WORLD";
}