import type { PhysicsToolBase } from "./Physics";

export type InternalHeatTool = PhysicsToolBase<
    "INTERNAL_HEAT",
    {
        power: number;
        distribution: "UNIFORM" | "RADIAL";
        radius?: number;
    }
>