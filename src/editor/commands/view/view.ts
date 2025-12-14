import { useEditorStore } from "../../../store/editorStore";

export function setSingleView() {
    useEditorStore.getState().setViewMode("SINGLE");
}

export function setSplitView() {
    useEditorStore.getState().setViewMode("SPLIT_2D_3D");
}

export function setAxis() {
    useEditorStore.getState().setViewMode("AXIS");
}

export function setPerspective() {
    useEditorStore.getState().setViewMode("PERSPECTIVE");
}

export function setOrthographic() {
    useEditorStore.getState().setViewMode("ORTHOGRAPHIC");
}

export function toggleGrid() {
    useEditorStore.getState().toggleGrid();
}