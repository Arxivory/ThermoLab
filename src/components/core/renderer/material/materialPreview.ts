import * as THREE from "three";
import { createLighting, createPreviewSphere, updatePreview } from "./previewSphere";

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let fov = 45;

export function initMaterialPreview(canvas: HTMLCanvasElement) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });

    renderer.setSize(width, height, false);

    createLighting(scene);
    createPreviewSphere(scene);

    renderer.render(scene, camera);
}

export function updateMaterialPreview(id: string) {
    if (!(renderer && scene && camera)) return;
    updatePreview(id, renderer, scene, camera);
}
