export type PhysicsToolType = 
    | "TEMPERATURE"
    | "INTERNAL_HEAT"
    | "HEAT_FLUX"
    | "INSULATION"
    | "CONVECTION"
    | "RADIATION"
    | "ANGULAR_VELOCITY"
    | "LINEAR_VELOCITY"
    | "INLET_VELOCITY"
    | "OUTLET"
    | "PRESSURE"

export interface PhysicsToolBase<T extends PhysicsToolType, P> {
    id: string;
    type: T;
    target: {
        kind: "OBJECT" | "DOMAIN"
        id: string;
    };
    enabled: boolean;
    parameters: P;

    timeControl?: {
        startTime: number;
        endTime?: number;
        ramp?: "LINEAR" | "SMOOTH";
    };
}