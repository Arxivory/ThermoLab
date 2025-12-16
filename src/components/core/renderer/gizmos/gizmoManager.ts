import { transformControls } from "./transformControls";
import { getScene } from "../sceneAccess";
import { useEditorStore } from "../../../../store/editorStore";

getScene().add(transformControls);

let currentId: string | null = null;

export function updateGizmo() {
    const selectedId = useEditorStore.getState().selectedObjectId;

    if (selectedId === currentId) return;

    currentId = selectedId;

    if (!selectedId) {
        transformControls.detach();
        return;
    }

    const obj = useEditorStore.getState().objects[selectedId];
    if (obj) {
        transformControls.attach(obj.object);
    }
}