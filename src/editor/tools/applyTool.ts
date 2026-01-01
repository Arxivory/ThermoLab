import * as FACTORIES from "../../core/simulation/tools/factories";
import type { PhysicsToolType } from "../../core/simulation/tools/Physics";
import { useEditorStore } from "../../store/editorStore";

export function applyToolToObject(type: PhysicsToolType) {
    const state = useEditorStore.getState();
    const objectId = state.selectedObjectId;

    if (!objectId) {
        console.warn('No selected object ID');
        return;
    }

    let tool;

    switch(type) {
        case "TEMPERATURE":
            tool = FACTORIES.applyTemperature(objectId);
            break;

        case "INTERNAL_HEAT":
            tool = FACTORIES.applyInternalHeat(objectId);
            break;

        case "HEAT_FLUX":
            tool = FACTORIES.applyHeatFlux(objectId);
            break;

        case "CONVECTION":
            tool = FACTORIES.applyConvectionTool(objectId);
            break;

        case "INSULATION":
            tool = FACTORIES.applyInsulationTool(objectId);
            break;

        case "RADIATION":
            tool = FACTORIES.applyRadiationTool(objectId);
            break;
        
        case "ANGULAR_VELOCITY":
            tool = FACTORIES.applyAngularVelocity(objectId);
            break;

        case "LINEAR_VELOCITY":
            tool = FACTORIES.applyLinearVelocity(objectId);
            break;
    }
}