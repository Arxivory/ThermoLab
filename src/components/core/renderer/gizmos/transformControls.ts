import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { getCamera, getControls, getRenderer, getScene } from "../sceneAccess";
import { useEditorStore } from "../../../../store/editorStore";

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

        obj.position.copy(obj.object.position);
        obj.rotation.copy(obj.object.rotation);
        obj.scale.copy(obj.object.scale);
    });

    transformControls.addEventListener("dragging-changed", (e) => {
        controls.enabled = !e.value;
    });

    useEditorStore.subscribe(
        (state) => state.transformMode,
        (mode) => {
            console.log(mode);
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
