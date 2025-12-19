import * as THREE from "three"

export type SceneObjectType =
    | "PRIMITIVE"
    | "IMPORTED"

export interface SceneObject {
    id: string;
    name: string;
    type: SceneObjectType;

    object: THREE.Object3D;

    transformations: {
        position: { x: number, y: number, z: number },
        rotation: { x: number, y: number, z: number },
        scale: { x: number, y: number, z: number }
    }
}