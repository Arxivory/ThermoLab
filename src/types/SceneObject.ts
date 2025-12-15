import * as THREE from "three"

export type SceneObjectType =
    | "PRIMITIVE"
    | "IMPORTED"

export interface SceneObject {
    id: string;
    name: string;
    type: SceneObjectType;

    object: THREE.Object3D;

    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
}