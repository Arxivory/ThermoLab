import type { PhysicsToolBase } from "./Physics";

export type AngularVelocityTool = PhysicsToolBase<
    "ANGULAR_VELOCITY",
    {
        omega: {
            x: number;
            y: number;
            z: number;
        }
        space: "LOCAL" | "WORLD"
    }
>