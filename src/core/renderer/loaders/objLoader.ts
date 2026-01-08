import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { getScene } from "../sceneAccess"
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'

const loader = new OBJLoader();
const stlLoader = new STLLoader();
const texLoader = new RGBELoader();

export function loadOBJ(file: File): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const contents = event.target?.result as string;
                const object = loader.parse(contents);

                texLoader.load( 'textures/environmentmaps/autumn_hill_view_4k.hdr', ( texture ) => {
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    getScene().environment = texture;

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
                    if ((child as THREE.Mesh).isMesh) {
                        (child as THREE.Mesh).material = defaultSampleMaterial;
                    }
                });

                getScene().add(object);
                resolve(object);
            } catch (error) {
                reject(error);
            }
        }

        reader.onerror = reject;
        reader.readAsText(file);
    })
}

export function loadSTL(file: File): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const contents = event.target?.result as string;
                const object = loader.parse(contents);

                texLoader.load( 'textures/environmentmaps/autumn_hill_view_4k.hdr', ( texture ) => {
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    getScene().environment = texture;

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
                    if ((child as THREE.Mesh).isMesh) {
                        (child as THREE.Mesh).material = defaultSampleMaterial;
                    }
                });

                getScene().add(object);
                resolve(object);

            } catch (error) {
                reject(error);
            }
        }

        reader.onerror = reject;
        reader.readAsText(file);
    })
}