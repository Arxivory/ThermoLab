import type { PhysicsToolInstance } from "../../core/simulation/tools";
import type { TemperatureTool } from "../../core/simulation/tools/Temperature";
import { useEditorStore } from "../../store/editorStore";

const updateTool = useEditorStore((s) => s.updateTool);

export function updateToolParameters<T extends PhysicsToolInstance>(
    tool: T,
    updater: (params: T["parameters"]) => T["parameters"]
): T {
    return {
        ...tool,
        parameters: updater(tool.parameters)
    }
}