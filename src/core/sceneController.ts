import * as THREE from "three";
import { getScene } from "./renderer/sceneAccess";
import { toggleGrid } from "./renderer/setupDefaultScene";

export function addObjectToScene(object: THREE.Object3D) {
    getScene().add(object);
}

export function toggleGridVisibility(visible: boolean) {
    toggleGrid(visible);
}