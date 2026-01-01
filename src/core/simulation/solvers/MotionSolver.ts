import type { CompiledSimulation, MotionConstraint } from "../types/CompiledSimulation";

export interface MotionState {
    linearVelocity: Map<string, { x: number, y: number, z: number}>;
    angularVelocity: Map<string, { x: number, y: number, z: number}>;
}

export class MotionSolver {
    static initialize(simulation: CompiledSimulation): MotionState {
        const linearVelocity = new Map();
        const angularVelocity = new Map();

        for (const motion of simulation.motions) {
            switch (motion.kind) {
                case "LINEAR_VELOCITY":
                    linearVelocity.set(motion.objectId, {
                        ...motion.velocity
                    });
                    break;

                case "ANGULAR_VELOCITY":
                    angularVelocity.set(motion.objectId, {
                        ...motion.omega
                    });
                    break;
            }
        }

        return { linearVelocity, angularVelocity };
    }

    static apply(
        simulation: CompiledSimulation,
        state: MotionState,
        dt: number
    ) {
        for (const object of simulation.objects) {
            const lin = state.linearVelocity.get(object.id);
            const ang = state.angularVelocity.get(object.id);

            if (lin) {
                object.mesh.position.x += lin.x * dt;
                object.mesh.position.y += lin.y * dt;
                object.mesh.position.z += lin.z * dt;
            }

            if (ang) {
                object.mesh.rotation.x += ang.x * dt;
                object.mesh.rotation.y += ang.y * dt;
                object.mesh.rotation.z += ang.z * dt;
            }
        }
    }
}