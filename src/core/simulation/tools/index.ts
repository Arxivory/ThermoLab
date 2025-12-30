import type { TemperatureTool } from "./Temperature";
import type { InternalHeatTool } from "./InternalHeat";
import type { HeatFluxTool } from "./HeatFlux";
import type { InsulationTool } from "./InsulationTool";
import type { ConvectionTool } from "./Convection";
import type { RadiationTool } from "./Radiation";
import type { AngularVelocityTool } from "./AngularVelocity";
import type { LinearVelocityTool } from "./LinearVelocity";
import type { InletVelocityTool } from "./Fluid";
import type { OutletTool } from "./Fluid";
import type { PressureTool } from "./Fluid";

export type PhysicsToolInstance =
  | TemperatureTool
  | InternalHeatTool
  | HeatFluxTool
  | InsulationTool
  | ConvectionTool
  | RadiationTool
  | AngularVelocityTool
  | LinearVelocityTool
  | InletVelocityTool
  | OutletTool
  | PressureTool;
