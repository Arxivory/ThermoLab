import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { getScene } from "../sceneAccess"

const loader = new OBJLoader();

export function loadOBJ(file: File): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const contents = event.target?.result as string;
                const object = loader.parse(contents);

                getScene().add(object);
                resolve(object);
            } catch (error) {
                reject(error);
            }
        }

        reader.onerror = reject;
        reader.readAsText(file);
    })
}