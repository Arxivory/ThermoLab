import * as THREE from "three"
import { useEditorStore } from "../../../store/editorStore";
import { toSceneColor } from "../../../utils/colorDataConverters";

let material: THREE.MeshPhysicalMaterial;
let sphere: THREE.Mesh;

export function createPreviewSphere(scene: THREE.Scene) {

    if (!material) {
        material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.78,
            roughness: 0.15,
            reflectivity: 0.3,
            opacity: 1.0,
            transparent: true
        });
    }    

    const sphereGeometry = new THREE.SphereGeometry(2.5, 32, 32);

    sphere = new THREE.Mesh(sphereGeometry, material);

    scene.add(sphere);
}

export function createLighting(scene: THREE.Scene) {
    const dirLight = new THREE.PointLight(0xffffff, 1);
    dirLight.position.set(2, 3, 3);
    scene.add(dirLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
}

export function updatePreview(id: string, renderer: THREE.WebGLRenderer, 
    scene: THREE.Scene, 
    camera: THREE.PerspectiveCamera) {
    const store = useEditorStore.getState();

    const newMaterial = store.objects[id].appearance;

    material.color = toSceneColor(newMaterial.color);
    material.roughness = newMaterial.roughness;
    material.metalness = newMaterial.metalness;
    material.reflectivity = newMaterial.reflectivity;
    material.opacity = newMaterial.opacity;

    renderer.render(scene, camera);
}