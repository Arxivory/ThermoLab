import { create } from "zustand";
import type { SceneObject } from "../types/SceneObject";
import { subscribeWithSelector } from "zustand/middleware";

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

    viewMode: ViewMode
    gridEnabled: boolean

    activeModal: EditorModal

    sceneLoaded: boolean

    importedFile: File | null

    objects: Record<string, SceneObject>

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

    updateObjectMaterial: (
        id: string,
        appearance: SceneObject["appearance"]
    )
}

export const useEditorStore = create<EditorState>()(
    subscribeWithSelector((set) => ({
        activeCategory: "HOME",
        selectedObjectId: null,

        viewMode: "SINGLE",
        gridEnabled: true,

        activeModal: "NONE",

        sceneLoaded: false,

        importedFile: null,

        objects: {},

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

        updateObjectMaterial: (id, appearance) => 
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
                                reflectivity: appearance.metalness,
                                opacity: appearance.opacity
                            }
                        }
                    }
                }
            })
    }))
);
