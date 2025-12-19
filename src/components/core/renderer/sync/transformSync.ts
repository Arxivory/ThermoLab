import { useEditorStore } from "../../../../store/editorStore";

export function initSceneTransformSync() {
  useEditorStore.subscribe(
    (s) => s.objects,
    (objects) => {
      for (const obj of Object.values(objects)) {
        const t = obj.transformations;
        if (!t) continue;

        obj.object.position.set(
          t.position.x,
          t.position.y,
          t.position.z
        );

        obj.object.rotation.set(
          t.rotation.x,
          t.rotation.y,
          t.rotation.z
        );

        obj.object.scale.set(
          t.scale.x,
          t.scale.y,
          t.scale.z
        );
      }
    }
  );
}
