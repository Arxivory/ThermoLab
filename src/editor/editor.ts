import { useEditorStore } from "../store/editorStore";

import { newProject } from "./commands/file/newProject";
import { openProject } from "./commands/file/openProject";
import { saveProject } from "./commands/file/saveProject";
import { importObject } from "./commands/file/importObject";
import { exportObject } from "./commands/file/exportObject";

import { addGeometry } from "./commands/geometry/addGeometry";

import { copyObject, 
    cutObject, 
    pasteObject, 
    groupObjects, 
    unGroupObjects, 
    deleteObject 
} from "./commands/object/object";

import { setSingleView,
    setSplitView,
    setAxis,
    setOrthographic,
    setPerspective,
    toggleGrid
} from "./commands/view/view";

import { setUnitsSystem,
    openSceneSettings,
    setEnvironmentSettings
} from "./commands/scene/scene";

import type { EditorAction } from "../types/EditorActions";

type EditorCommand = (payload?: any) => void;

const editorCommandMap: Record<EditorAction, EditorCommand> = {
    PROJECT_NEW: () => newProject(),
    PROJECT_OPEN: () => openProject(),
    PROJECT_SAVE: () => saveProject(),
    IMPORT_OBJECT: (file?: File) => file && importObject(file),
    EXPORT: () => exportObject(),

    ADD_GEOMETRY: (geometryType: string) =>
        addGeometry(geometryType),

    OPEN_GEOMETRY: () => useEditorStore.getState().openModal("GEOMETRY"),

    COPY: () => copyObject(useEditorStore.getState().selectedObjectId),
    CUT: () => cutObject(useEditorStore.getState().selectedObjectId),
    PASTE: () => pasteObject(),
    GROUP: () => groupObjects(),
    UNGROUP: () => unGroupObjects(),
    DELETE: () => deleteObject(useEditorStore.getState().selectedObjectId),

    VIEW_SINGLE: () => setSingleView(),
    VIEW_SPLIT: () => setSplitView(),
    VIEW_AXIS: () => setAxis(),
    VIEW_PERSPECTIVE: () => setPerspective(),
    VIEW_ORTHOGRAPHIC: () => setOrthographic,
    TOGGLE_GRID: () => toggleGrid(),

    UNITS_SYSTEM: () => setUnitsSystem(),
    SCENE_SETTINGS: () => openSceneSettings(),
    ENVIRONMENT: () => setEnvironmentSettings()
}

export function executeEditorAction(
    action: EditorAction,
    payload?: any
) {
    editorCommandMap[action]?.(payload);
}