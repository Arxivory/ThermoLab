import type { EditorState } from "../../store/editorStore";
import type { BoundaryCondition, CompiledSimulation, MotionConstraint, SourceTerm } from "./types/CompiledSimulation";

export class SimulationCompiler {
    static compile(editor: Pick<EditorState, "objects" | "tools">): CompiledSimulation {
        const objects = this.compileObjects(editor.objects);
        const {
            boundaryConditions,
            sources,
            motions
        } = this.compileTools(editor.tools);

        return {
            metadata: {
                objectCount: objects.length,
                toolCount: Object.keys(editor.tools).length
            },
            objects,
            boundaryConditions,
            sources,
            motions
        };
    }

    private static compileObjects(
        objects: EditorState["objects"]
    ) {
        return Object.values(objects).map((obj) => ({
            id: obj.id,
            mesh: obj.object,
            transformMatrix: obj.object.matrixWorld.elements.slice(0),
            material: {
                density: obj.material.density,
                specificHeat: obj.material.specificHeat,
                thermalConductivity: obj.material.thermalConductivity,
                emissivity: obj.material.emissivity,
                absorptivity: obj.material.absorptivity
            }
        }));
    }

    private static compileTools(
        tools: EditorState["tools"]
    ) {
        const boundaryConditions: BoundaryCondition[] = [];
        const sources: SourceTerm[] = [];
        const motions: MotionConstraint[] = [];

        for (const tool of Object.values(tools)) {
            if (!tool.enabled) continue;

            switch (tool.type) {
                case "TEMPERATURE":
                    boundaryConditions.push({
                        kind: "FIXED_TEMPERATURE",
                        objectId: tool.target.id,
                        temperature: tool.parameters.temperature,
                        applyTo: tool.parameters.applyTo
                    });
                    break;

                case "HEAT_FLUX":
                    boundaryConditions.push({
                        kind: "HEAT_FLUX",
                        objectId: tool.target.id,
                        flux: tool.parameters.flux,
                        direction: tool.parameters.direction
                    });
                    break;

                case "CONVECTION":
                    boundaryConditions.push({
                        kind: "CONVECTION",
                        objectId: tool.target.id,
                        heatTransferCoefficient: tool.parameters.heatTransferCoefficient,
                        ambientTemperature: tool.parameters.ambientTemperature
                    });
                    break;

                case "RADIATION":
                    boundaryConditions.push({
                        kind: "RADIATION",
                        objectId: tool.target.id,
                        environmentTemperature: tool.parameters.environmentTemperature,
                        viewFactor: tool.parameters.viewFactor ?? 1.0
                    });
                    break;

                case "INSULATION":
                    boundaryConditions.push({
                        kind: "INSULATION",
                        objectId: tool.target.id
                    });
                    break;

                case "INTERNAL_HEAT":
                    sources.push({
                        kind: "INTERNAL_HEAT",
                        objectId: tool.target.id,
                        power: tool.parameters.power,
                        distribution: tool.parameters.distribution,
                        radius: tool.parameters.radius
                    });
                    break;

                case "ANGULAR_VELOCITY":
                    motions.push({
                        kind: "ANGULAR_VELOCITY",
                        objectId: tool.target.id,
                        omega: tool.parameters.omega,
                        space: tool.parameters.space
                    });
                    break;

                case "LINEAR_VELOCITY":
                    motions.push({
                        kind: "LINEAR_VELOCITY",
                        objectId: tool.target.id,
                        velocity: tool.parameters.velocity,
                        space: tool.parameters.space
                    });
                    break;

                case "INTERNAL_HEAT":
                    sources.push({
                        kind: "INTERNAL_HEAT",
                        objectId: tool.target.id,
                        power: tool.parameters.power,
                        distribution: tool.parameters.distribution,
                        radius: tool.parameters.radius
                    });
                    break;
            }
        }

        return { boundaryConditions, sources, motions };
    }
}