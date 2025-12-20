import * as THREE from "three";
import { v4 as uuid } from "uuid";
import { useEditorStore } from "../../../store/editorStore";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { addObjectToScene } from "../../../components/core/sceneController";
import { getEnvironmentMap } from "../../../components/core/renderer/environmentManager";
import { getRenderer } from "../../../components/core/renderer/sceneAccess";
import { toHexColor } from "../../../utils/colorDataConverters";

const loader = new OBJLoader();

export async function importObject(file: File) {
    const reader = new FileReader();

    reader.onload = async () => {
        const object = loader.parse(reader.result as string);

        object.name = file.name;

        const envMap = await getEnvironmentMap(getRenderer());

        const defaultMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.78,
            roughness: 0.15,
            reflectivity: 0.3,
            envMap,
            envMapIntensity: 1.0
        })

        object.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) 
                (child as THREE.Mesh).material = defaultMaterial;
        })

        addObjectToScene(object);

        useEditorStore.getState().addObject({
            id: uuid(),
            name: file.name,
            type: "IMPORTED",
            object: object,
            transformations: {
                position: { x: object.position.x, y: object.position.y, z: object.position.z },
                rotation: { x: object.rotation.x, y: object.rotation.y, z: object.rotation.z },
                scale: { x: object.scale.x, y: object.scale.y, z: object.scale.z }
            },
            appearance: {
                color: toHexColor(defaultMaterial.color),
                roughness: defaultMaterial.roughness,
                metalness: defaultMaterial.metalness,
                reflectivity: defaultMaterial.metalness,
                opacity: defaultMaterial.opacity
            }
        });
    };

    reader.readAsText(file);
}