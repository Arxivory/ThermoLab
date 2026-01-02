import { v4 as uuid } from "uuid";
import type { TemperatureTool, } from "./Temperature";
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

export function applyTemperature(
    objectId: string
): TemperatureTool {
    return {
        id: uuid(),
        type: "TEMPERATURE",
        target: {
            kind: "OBJECT",
            id: objectId
        },
        enabled: true,
        parameters: {
            temperature: 300,
            applyTo: "SURFACE"
        }
    };
}

export function applyInternalHeat(
    objectId: string
): InternalHeatTool {
    return {
        id: uuid(),
        type: "INTERNAL_HEAT",
        target: {
            kind: "OBJECT",
            id: objectId
        },
        enabled: true,
        parameters: {
            power: 300,
            distribution: "UNIFORM",
            radius: 10
        }
    };
}

export function applyHeatFlux(
    objectId: string
): HeatFluxTool {
    return {
        id: uuid(),
        type: "HEAT_FLUX",
        target: {
            kind: "OBJECT",
            id: objectId
        },
        enabled: true,
        parameters: {
            flux: 1000,
            direction: "IN"
        }
    }
}

export function applyInsulationTool(
    objectId: string
): InsulationTool {
    return {
        id: uuid(),
        type: "INSULATION",
        target: {
            kind: "OBJECT",
            id: objectId
        },
        enabled: true,
        parameters:{}
    }
}

export function applyConvectionTool(
    objectId: string
): ConvectionTool {
    return {
        id: uuid(),
        type: "CONVECTION",
        target: {
            kind: "OBJECT",
            id: objectId
        },
        enabled: true,
        parameters: {
            heatTransferCoefficient: 10,
            ambientTemperature: 288
        }
    }
}

export function applyRadiationTool(
    objectId: string
): RadiationTool {
    return {
        id: uuid(),
        type: "RADIATION",
        target: {
            kind: "OBJECT",
            id: objectId
        },
        enabled: true,
        parameters: {
            environmentTemperature: 288,
            viewFactor: 10
        }
    }
}

export function applyAngularVelocity(
    objectId: string
): AngularVelocityTool {
    return {
        id: uuid(),
        type: "ANGULAR_VELOCITY",
        target: {
            kind: "OBJECT",
            id: objectId
        },
        enabled: true,
        parameters: {
            omega: {
                x: 0,
                y: -10,
                z: 0
            },
            space: "LOCAL"
        }
    }
}

export function applyLinearVelocity(
    objectId: string
): LinearVelocityTool {
    return {
        id: uuid(),
        type: "LINEAR_VELOCITY",
        target: {
            kind: "OBJECT",
            id: objectId
        },
        enabled: true,
        parameters: {
            velocity: {
                x: 0,
                y: 0,
                z: 0
            },
            space: "LOCAL"
        }
    }
}

export function applyInletVelocity(
    domainId: string,
    fluidType: "AIR" | "WATER"
): InletVelocityTool {
    return {
        id: uuid(),
        type: "INLET_VELOCITY",
        target: {
            kind: "DOMAIN",
            id: domainId
        },
        enabled: true,
        parameters: {
            velocity: {
                x: 0,
                y: 0,
                z: 0
            },
            fluidType: fluidType,
            turbulenceLevel: 0
        }
    }
}

export function applyOutlet(
    domainId: string
): OutletTool {
    return {
        id: uuid(),
        type: "OUTLET",
        target: {
            kind: "DOMAIN",
            id: domainId
        },
        enabled: true,
        parameters: {}
    }
}

export function applyPressure(
    domainId: string
): PressureTool {
    return {
        id: uuid(),
        type: "PRESSURE",
        target: {
            kind: "DOMAIN",
            id: domainId
        },
        enabled: true,
        parameters: {
            pressure: 0
        }
    }
}