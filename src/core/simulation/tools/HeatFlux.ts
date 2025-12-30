import type { PhysicsToolBase } from "./Physics";

export type HeatFluxTool = PhysicsToolBase<
    "HEAT_FLUX",
    {
        flux: number;
        direction: "IN" | "OUT";
    }
>