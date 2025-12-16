import * as THREE from "three";
import { getCamera } from "./sceneAccess";
import { getScene } from "./sceneAccess";
import { useEditorStore } from "../../../store/editorStore";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function onCanvasClick(event: MouseEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, getCamera());

    const objects = Object.values(
        useEditorStore.getState().objects
    ).map(o => o.object);

    const hits = raycaster.intersectObjects(objects, true);

    if (hits.length === 0) {
        useEditorStore.getState().selectObject(null);
        return;
    }

    const hit = hits[0].object;

    const entry = Object.values(useEditorStore.getState().objects)
    .find(o => o.object === hit || o.object.children.some(child => child === hit));

    if (entry) useEditorStore.getState().selectObject(entry.id);
}