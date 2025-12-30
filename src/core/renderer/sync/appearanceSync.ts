import { useEditorStore } from "../../../store/editorStore";
import { toSceneColor } from "../../../utils/colorDataConverters";

export function initAppearanceSync() {
    useEditorStore.subscribe(
        (s) => s.objects,
        (objects) => {
            for (const obj of Object.values(objects)) {
                const a = obj.appearance;
                if (!a) continue;

                obj.object.material.color = toSceneColor(a.color);
                obj.object.material.roughness = a.roughness;
                obj.object.material.metalness = a.metalness;
                obj.object.material.reflectivity = a.reflectivity;
                obj.object.material.opacity = a.opacity;

            }
        }
    );
}