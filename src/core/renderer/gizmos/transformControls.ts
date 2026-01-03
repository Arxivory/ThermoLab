import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { getCamera, getControls, getRenderer, getScene } from "../sceneAccess";
import { useEditorStore } from "../../../store/editorStore";

let transformControls: TransformControls | null = null;

export function initTransformControls() {
    const camera = getCamera();
    const renderer = getRenderer();
    const scene = getScene();
    const controls = getControls();

    if (!camera || !renderer || !scene) {
        console.error("TransformControls init failed: renderer not ready");
        return;
    }

    transformControls = new TransformControls(camera, renderer.domElement);
    scene.add(transformControls.getHelper());

    transformControls.setMode("translate");

    transformControls.addEventListener("objectChange", () => {
        const id = useEditorStore.getState().selectedObjectId;
        if (!id) return;

        const obj = useEditorStore.getState().objects[id];
        if (!obj) return;

        useEditorStore.getState().updateObjectTransform(id, {
            position: {
                x: obj.object.position.x,
                y: obj.object.position.y,
                z: obj.object.position.z
            },
            rotation: {
                x: obj.object.rotation.x,
                y: obj.object.rotation.y,
                z: obj.object.rotation.z
            },
            scale: {
                x: obj.object.scale.x,
                y: obj.object.scale.y,
                z: obj.object.scale.z
            }
        })
        
    });

    transformControls.addEventListener("dragging-changed", (e) => {
        controls.enabled = !e.value;
    });

    useEditorStore.subscribe(
        (state) => state.transformMode,
        (mode) => {
            if (!transformControls) return;
            if (mode === "TRANSLATE") transformControls.setMode("translate");
            if (mode === "ROTATE") transformControls.setMode("rotate");
            if (mode === "SCALE") transformControls.setMode("scale");
        }
    );

    useEditorStore.subscribe(
        (state) => state.selectedObjectId,
        (id) => {
            if (!transformControls) return;

            if (!id) {
                transformControls.detach();
                return;
            }

            const obj = useEditorStore.getState().objects[id];
            if (obj) { 
                transformControls.attach(obj.object);
            }
        }
    );
}

export function getTransformControls() {
    return transformControls;
}
