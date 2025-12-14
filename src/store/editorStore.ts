import { create } from "zustand";

export type ViewMode = 
    | "SINGLE"
    | "SPLIT_2D_3D"
    | "AXIS"
    | "PERSPECTIVE"
    | "ORTHOGRAPHIC"

interface EditorState {
    activeCategory: "HOME" | "TOOLS"
    selectedObjectId: string | null;

    viewMode: ViewMode
    gridEnabled: boolean

    sceneLoaded: boolean

    importedFile: File | null

    setActiveCategory: (cat: "HOME" | "TOOLS") => void
    setSelectedObject: (id: string | null) => void
    setViewMode: (mode: ViewMode) => void
    toggleGrid: () => void
    setImportedFile: (file: File | null) => void
}

export const useEditorStore = create<EditorState>((set) => ({
    activeCategory: "HOME",
    selectedObjectId: null,

    viewMode: "SINGLE",
    gridEnabled: true,

    sceneLoaded: false,

    importedFile: null,

    setActiveCategory: (cat) => set({ activeCategory: cat }),
    setSelectedObject: (id) => set({ selectedObjectId: id }),
    setViewMode: (mode) => set({ viewMode: mode }),
    toggleGrid: () => set((state) => ({ gridEnabled: !state.gridEnabled })),
    setImportedFile: (file) => set({ importedFile: file })
}))