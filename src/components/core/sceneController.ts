import * as THREE from "three";
import { getScene } from "./renderer/sceneAccess";

export function addObjectToScene(object: THREE.Object3D) {
    getScene().add(object);
}