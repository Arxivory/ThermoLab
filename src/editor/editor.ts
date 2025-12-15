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

export type EditorAction =
    | "PROJECT_NEW"
    | "PROJECT_OPEN"
    | "PROJECT_SAVE"
    | "IMPORT_OBJECT"
    | "EXPORT"
    | "ADD_GEOMETRY"
    | "OPEN_GEOMETRY"
    | "COPY"
    | "CUT"
    | "PASTE"
    | "GROUP"
    | "UNGROUP"
    | "DELETE"
    | "VIEW_SINGLE"
    | "VIEW_SPLIT"
    | "VIEW_AXIS"
    | "VIEW_PERSPECTIVE"
    | "VIEW_ORTHOGRAPHIC"
    | "TOGGLE_GRID"
    | "UNITS_SYSTEM"
    | "SCENE_SETTINGS"
    | "ENVIRONMENT"


export function executeEditorAction(action: EditorAction, file?: File) {
    const state = useEditorStore.getState();

    switch (action) {
        case "PROJECT_NEW":
            return newProject();
        case "PROJECT_OPEN":
            return openProject();
        case "PROJECT_SAVE":
            return saveProject();
        case "IMPORT_OBJECT":
            if (file) {
                useEditorStore.getState().setImportedFile(file);
                return importObject(file);
            }
            return;
        case "EXPORT":
            return exportObject();
        case "ADD_GEOMETRY":
            return addGeometry();
        case "OPEN_GEOMETRY":
            return useEditorStore.getState().openModal("GEOMETRY");
        case "COPY":
            return copyObject(state.selectedObjectId);
        case "CUT":
            return cutObject(state.selectedObjectId);
        case "PASTE":
            return pasteObject();
        case "GROUP":
            return groupObjects();
        case "UNGROUP":
            return unGroupObjects();
        case "DELETE":
            return deleteObject(state.selectedObjectId);
        case "VIEW_SINGLE":
            return setSingleView();
        case "VIEW_SPLIT":
            return setSplitView();
        case "VIEW_PERSPECTIVE":
            return setPerspective();
        case "VIEW_ORTHOGRAPHIC":
            return setOrthographic();
        case "VIEW_AXIS":
            return setAxis();
        case "TOGGLE_GRID":
            return toggleGrid();
        case "UNITS_SYSTEM":
            return setUnitsSystem();
        case "SCENE_SETTINGS":
            return openSceneSettings();
        case "ENVIRONMENT":
            return setEnvironmentSettings();
    }
}