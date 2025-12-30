import type { PhysicsToolBase } from "./Physics";

export type InletVelocityTool = PhysicsToolBase<
  "INLET_VELOCITY",
  {
    velocity: { x: number; y: number; z: number }; 
    fluidType: "AIR" | "WATER";
    turbulenceLevel?: number; 
  }
>;

export type OutletTool = PhysicsToolBase<
  "OUTLET",
  {}
>;

export type PressureTool = PhysicsToolBase<
  "PRESSURE",
  {
    pressure: number; 
  }
>;
