import type { PhysicsToolBase } from "./Physics";

export type TemperatureTool = PhysicsToolBase<
    "TEMPERATURE",
    {
        temperature: number;
        applyTo: "SURFACE" | "VOLUME";
    }
>;