import * as THREE from "three"

export function toSceneColor(hex: string) {
    return new THREE.Color(hex);
}

export function toHexColor(sceneColor: THREE.Color) {
    return `#${sceneColor.getHexString()}`;
}