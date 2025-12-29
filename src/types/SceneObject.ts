import * as THREE from "three"

export type SceneObjectType =
    | "PRIMITIVE"
    | "IMPORTED"

export type ObjectTags = 
    | "TEMPERATURE"
    | "INTERNAL_HEAT"
    | "CONVECTION"
    | "HEAT_FLUX"
    | "INSULATION"
    | "RADIATION"
    | "ANGULAR_VELOCITY"
    | "LINEAR_VELOCITY"
    | "FORCE"

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

    appearance: {
        color: string,
        roughness: number,
        metalness: number,
        reflectivity: number,
        opacity: number
    }

    material: {
        density: number,
        specificHeat: number,
        thermalConductivity: number,
        elasticModulus: number,
        emissivity: number,
        absorptivity: number
    }
}