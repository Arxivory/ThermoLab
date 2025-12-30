import type { PhysicsToolBase } from "./Physics";

export type LinearVelocityTool = PhysicsToolBase<
    "LINEAR_VELOCITY",
    {
        velocity: {
            x: number;
            y: number;
            z: number;
        }
        space: "LOCAL" | "WORLD";
    }
>