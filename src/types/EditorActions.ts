export type ProjectAction = 
    | "PROJECT_NEW"
    | "PROJECT_OPEN"
    | "PROJECT_SAVE"
    | "IMPORT_OBJECT"
    | "EXPORT"

export type GeometryAction = 
    | "ADD_GEOMETRY"

export type ObjectAction = 
    | "COPY"
    | "CUT"
    | "PASTE"
    | "GROUP"
    | "UNGROUP"
    | "DELETE"

export type ViewAction = 
    | "VIEW_SINGLE"
    | "VIEW_SPLIT"
    | "VIEW_AXIS"
    | "VIEW_PERSPECTIVE"
    | "VIEW_ORTHOGRAPHIC"
    | "TOGGLE_GRID"

export type SceneAction =
    | "UNITS_SYSTEM"
    | "SCENE_SETTINGS"
    | "ENVIRONMENT"

export type ModalAction = 
    | "OPEN_GEOMETRY"

export type EditorAction =
    | ProjectAction
    | GeometryAction
    | ObjectAction
    | ViewAction
    | SceneAction
    | ModalAction
