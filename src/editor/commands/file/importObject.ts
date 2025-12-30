import * as THREE from "three";
import { v4 as uuid } from "uuid";
import { useEditorStore } from "../../../store/editorStore";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { addObjectToScene } from "../../../core/sceneController";
import { getEnvironmentMap } from "../../../core/renderer/environmentManager";
import { getRenderer } from "../../../core/renderer/sceneAccess";
import { toHexColor } from "../../../utils/colorDataConverters";

const loader = new OBJLoader();

function createPrimitiveAppearance(envMap: THREE.Texture) {
    return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.78,
        roughness: 0.15,
        reflectivity: 0.3,
        envMap,
        envMapIntensity: 1.0,
        transparent: true
    });
}

function createGenericMaterial() {
    return {
        density: 2000,
        specificHeat: 1000,
        thermalConductivity: 10,
        elasticModulus: 1e9,
        emissivity: 0.8,
        absorptivity: 0.8
    }
}

function handleMesh(mesh: THREE.Mesh, envMap: THREE.Texture) {
    mesh.material = createPrimitiveAppearance(envMap);

    addObjectToScene(mesh);
    useEditorStore.getState().addObject({
        id: uuid(),
        name: !mesh.name ? "Mesh" : mesh.name,
        type: "IMPORTED",
        object: mesh,
        transformations: {
            position: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
            rotation: { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z },
            scale: { x: mesh.scale.x, y: mesh.scale.y, z: mesh.scale.z }
        },
        appearance: {
            color: toHexColor(mesh.material.color),
            roughness: mesh.material.roughness,
            metalness: mesh.material.metalness,
            reflectivity: mesh.material.reflectivity,
            opacity: mesh.material.opacity
        },
        material: { ...createGenericMaterial() }
    });
}

export async function importObject(file: File) {
    const reader = new FileReader();

    reader.onload = async () => {
        const object = loader.parse(reader.result as string);

        object.name = file.name;

        const envMap = await getEnvironmentMap(getRenderer());

        const meshes: THREE.Mesh[] = [];

        object.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
                meshes.push(child);
            }
        });

        for (const mesh of meshes) {
            handleMesh(mesh, envMap);
        }

    };

    reader.readAsText(file);
}