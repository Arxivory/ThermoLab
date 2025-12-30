import type { PhysicsToolBase } from "./Physics";

export type RadiationTool = PhysicsToolBase<
    "RADIATION",
    {
        environmentTemperature: number;
        viewFactor?: number;
    }
>