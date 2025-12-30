import type { PhysicsToolBase } from "./Physics";

export type ConvectionTool = PhysicsToolBase<
    "CONVECTION",
    {
        heatTransferCoefficient: number;
        ambientTemperature: number;
    }
>