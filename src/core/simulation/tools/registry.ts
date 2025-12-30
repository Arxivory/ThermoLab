import type { PhysicsToolType } from "./Physics";

export const TOOL_REGISTRY: Record<
  PhysicsToolType,
  {
    label: string;
    target: "OBJECT" | "DOMAIN";
    category: "THERMAL" | "FLUID" | "MOTION";
  }
> = {
  TEMPERATURE: { label: "Temperature", target: "OBJECT", category: "THERMAL" },
  INTERNAL_HEAT: { label: "Internal Heat", target: "OBJECT", category: "THERMAL" },
  HEAT_FLUX: { label: "Heat Flux", target: "OBJECT", category: "THERMAL" },
  INSULATION: { label: "Insulation", target: "OBJECT", category: "THERMAL" },
  CONVECTION: { label: "Convection", target: "OBJECT", category: "THERMAL" },
  RADIATION: { label: "Radiation", target: "OBJECT", category: "THERMAL" },

  ANGULAR_VELOCITY: { label: "Angular Velocity", target: "OBJECT", category: "MOTION" },
  LINEAR_VELOCITY: { label: "Linear Velocity", target: "OBJECT", category: "MOTION" },

  INLET_VELOCITY: { label: "Inlet Velocity", target: "DOMAIN", category: "FLUID" },
  OUTLET: { label: "Outlet", target: "DOMAIN", category: "FLUID" },
  PRESSURE: { label: "Pressure", target: "DOMAIN", category: "FLUID" },
};