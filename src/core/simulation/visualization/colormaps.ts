import * as THREE from "three"

export function temperatureColor(t: number): THREE.Color {
    t = Math.max(0, Math.min(1, t));

    let r = 0, g = 0, b = 0;

    if (t < 0.125) {
        r = 0;
        g = 0;
        b = 0.5 + 4 * t;
    } else if (t < 0.375) {
        r = 0;
        g = 4 * (t - 0.125);
        b = 1;
    } else if (t < 0.625) {
        r = 4 * (t - 0.375);
        g = 1;
        b = 1 - 4 * (t - 0.375);
    } else if (t < 0.875) {
        r = 1;
        g = 1 - 4 * (t - 0.625);
        b = 0;
    } else {
        r = 1 - 4 * (t - 0.875);
        g = 0;
        b = 0;
    }

    return new THREE.Color(r, g, b);
}