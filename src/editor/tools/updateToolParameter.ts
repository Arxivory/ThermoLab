import type { PhysicsToolInstance } from "../../core/simulation/tools";

export function updateToolParameters<T extends PhysicsToolInstance>(
    tool: T,
    updater: (params: T["parameters"]) => T["parameters"]
): T {
    return {
        ...tool,
        parameters: updater(tool.parameters)
    }
}