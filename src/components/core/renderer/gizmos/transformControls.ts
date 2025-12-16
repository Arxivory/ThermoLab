import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { getCamera } from "../sceneAccess";
import { getRenderer } from "../sceneAccess";
import { useEditorStore } from "../../../../store/editorStore";

export const transformControls = new TransformControls(
    getCamera(),
    getRenderer().domElement
);

transformControls.addEventListener("dragging-changed", (e) => {
    useEditorStore.getState().setActiveCategory(
        e.value ? "TOOLS" : "HOME"
    );
});

transformControls.addEventListener("objectChange", () => {
    const id = useEditorStore.getState().selectedObjectId;
    if (!id) return;

    const obj = useEditorStore.getState().objects[id];
    if (!obj) return;

    obj.position.copy(obj.object.position);
    obj.rotation.copy(obj.object.rotation);
    obj.scale.copy(obj.object.scale);
});

useEditorStore.subscribe((state) => {
    const mode = state.transformMode;
    transformControls.setMode(
        mode === "TRANSLATE"
            ? "translate"
            : mode === "ROTATE"
            ? "rotate"
            : "scale"
    );
});


