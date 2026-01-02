import * as THREE from "three"

export function temperatureColor(t: number): THREE.Color {
    const color = new THREE.Color();
    color.setHSL((1 - t) * 0.66, 1.0, 0.5);
    return color;
}