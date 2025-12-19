import * as THREE from "three";
import { v4 as uuid } from "uuid";
import { useEditorStore } from "../../../store/editorStore";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { addObjectToScene } from "../../../components/core/sceneController";
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';


const texLoader = new RGBELoader();
const loader = new OBJLoader();

export function importObject(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
        const object = loader.parse(reader.result as string);

        object.name = file.name;

        texLoader.load( 'textures/environmentmaps/autumn_hill_view_4k.hdr', ( texture ) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;

            defaultSampleMaterial.envMap = texture;
            defaultSampleMaterial.needsUpdate = true;

        });

        const defaultSampleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, 
            metalness: 0.78,
            roughness: 0.15,
            reflectivity: 0.3
        });

        object.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) 
                (child as THREE.Mesh).material = defaultSampleMaterial;
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
            }
        });
    };

    reader.readAsText(file);
}