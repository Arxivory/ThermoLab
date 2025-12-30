import { create } from "zustand";
import type { SceneObject } from "../types/SceneObject";
import { subscribeWithSelector } from "zustand/middleware";
import type { PhysicsToolInstance } from "../core/simulation/tools";

export type ViewMode = 
    | "SINGLE"
    | "SPLIT_2D_3D"
    | "AXIS"
    | "PERSPECTIVE"
    | "ORTHOGRAPHIC"

type EditorModal =
    | "NONE"
    | "GEOMETRY"

export type TransformMode = 
    | "NONE"
    | "TRANSLATE"
    | "ROTATE"
    | "SCALE"

interface EditorState {
    activeCategory: "HOME" | "TOOLS"
    selectedObjectId: string | null;
    selectedToolId: string | null;

    viewMode: ViewMode
    gridEnabled: boolean

    activeModal: EditorModal

    sceneLoaded: boolean

    importedFile: File | null

    objects: Record<string, SceneObject>
    tools: Record<string, PhysicsToolInstance>

    transformMode: TransformMode;

    setActiveCategory: (cat: "HOME" | "TOOLS") => void
    setSelectedObject: (id: string | null) => void
    setViewMode: (mode: ViewMode) => void
    toggleGrid: () => void
    setImportedFile: (file: File | null) => void

    addObject: (obj: SceneObject) => void
    removeObject: (id: string) => void
    selectObject: (id: string | null) => void

    openModal: (modal: EditorModal) => void;
    closeModal: () => void;

    setTransformMode: (mode: TransformMode) => void;

    updateObjectTransform: (
        id: string, 
        transform: SceneObject["transformations"]
    ) => void;

    updateObjectAppearance: (
        id: string,
        appearance: SceneObject["appearance"]
    ) => void;

    updateObjectMaterial: (
        id: string,
        material: SceneObject["material"]
    ) => void;

    addTool: (tool: PhysicsToolInstance) => void;
    updateTool: (
        id: string,
        updater: (tool: PhysicsToolInstance) => PhysicsToolInstance
    ) => void;

    toggleTool: (id: string) => void;
    removeTool: (id: string) => void;
}

export const useEditorStore = create<EditorState>()(
    subscribeWithSelector((set) => ({
        activeCategory: "HOME",
        selectedObjectId: null,
        selectedToolId: null,

        viewMode: "SINGLE",
        gridEnabled: true,

        activeModal: "NONE",

        sceneLoaded: false,

        importedFile: null,

        objects: {},
        tools: {},

        transformMode: "TRANSLATE",

        setActiveCategory: (cat) => set({ activeCategory: cat }),
        setSelectedObject: (id) => set({ selectedObjectId: id }),
        setViewMode: (mode) => set({ viewMode: mode }),
        toggleGrid: () => set((state) => ({ gridEnabled: !state.gridEnabled })),
        setImportedFile: (file) => set({ importedFile: file }),

        addObject: (obj) =>
            set((state) => ({
                objects: {
                    ...state.objects,
                    [obj.id]: obj
                }
            })),

        removeObject: (id) =>
            set((state) => {
                const { [id]: _, ...rest } = state.objects;
                return { objects: rest, selectedObjectId: null };
            }),

        selectObject: (id) => set({ selectedObjectId: id }),

        openModal: (modal) => set({ activeModal: modal }),
        closeModal: () => set({ activeModal: "NONE" }),

        setTransformMode: (mode) => set({ transformMode: mode }),

        updateObjectTransform: (id, transform) =>
            set((state) => {
                const obj = state.objects[id];
                if (!obj) return state;

                return {
                    objects: {
                        ...state.objects,
                        [id]: {
                            ...obj,
                            transformations: {
                                position: { ...transform.position },
                                rotation: { ...transform.rotation },
                                scale: { ...transform.scale }
                            }
                        }
                    }
                }
            }),

        updateObjectAppearance: (id, appearance) => 
            set((state) => {
                const obj = state.objects[id];
                if (!obj) return state;

                return {
                    objects: {
                        ...state.objects,
                        [id]: {
                            ...obj,
                            appearance: {
                                color: appearance.color,
                                roughness: appearance.roughness,
                                metalness: appearance.metalness,
                                reflectivity: appearance.reflectivity,
                                opacity: appearance.opacity
                            }
                        }
                    }
                }
            }),

        updateObjectMaterial: (id, material) => 
            set((state) => {
                const obj = state.objects[id];
                if (!obj) return state;

                return {
                    objects: {
                        ...state.objects,
                        [id]: {
                            ...obj,
                            material: { ...material }
                        }
                    }
                }
            }),

        addTool: (tool) => 
            set((state) => ({
                tools: {
                    ...state.tools,
                    [tool.id]: tool,
                },
                selectedToolId: tool.id
            })),

        updateTool: (id, updater) =>
            set((state) => {
                const tool = state.tools[id];
                if (!tool) return state;

                return {
                tools: {
                    ...state.tools,
                    [id]: updater(tool),
                },
                };
            }),


        toggleTool: (id) =>
            set((state) => {
                const tool = state.tools[id];
                if (!tool) return state;

                return {
                    tools: {
                        ...state.tools,
                        [id]: {
                            ...tool,
                            enabled: !tool.enabled,
                        }
                    }
                }
            }),

        removeTool: (id) =>
            set((state) => {
                const { [id]: _, ...rest } = state.tools;
                return {
                    tools: rest,
                    selectedToolId: null
                }
            })
    }))
);
