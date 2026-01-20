import * as THREE from "three"

export function temperatureColor(t: number): THREE.Color {
    t = THREE.MathUtils.clamp(t, 0, 1);

    const r = THREE.MathUtils.clamp(Math.min(4 * t - 1.5, -4 * t + 4.5), 0, 1);
    const g = THREE.MathUtils.clamp(Math.min(4 * t - 0.5, -4 * t + 3.5), 0, 1);
    const b = THREE.MathUtils.clamp(Math.min(4 * t + 0.5, -4 * t + 2.5), 0, 1);

    return new THREE.Color(r, g, b);
}