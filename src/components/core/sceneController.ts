import { loadOBJ } from "./renderer/loaders/objLoader";

export async function importOBJ(path: File) {
    const object = await loadOBJ(path)
    return object
}