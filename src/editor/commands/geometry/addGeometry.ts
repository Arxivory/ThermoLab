import * as THREE from "three";
import { v4 as uuid } from "uuid";
import { useEditorStore } from "../../../store/editorStore";
import { addObjectToScene } from "../../../components/core/sceneController";
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const envMapLoader = new RGBELoader();
const defaultMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.78,
    roughness: 0.15,
    reflectivity: 0.3
});

export function addGeometry(geometryType: string) {
    envMapLoader.load('textures/environmentmaps/autumn_hill_view_4k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        defaultMaterial.envMap = texture;
        defaultMaterial.needsUpdate = true;
    })

    switch (geometryType) {
        case "ADD_PLANE":
            return addPlane()
        case "ADD_CUBE":
            return addCube()
        case "ADD_CIRCLE":
            return addCircle()
        case "ADD_SPHERE":
            return addSphere()
        case "ADD_CYLINDER":
            return addCylinder()
        case "ADD_CONE":
            return addCone()
        case "ADD_TORUS":
            return addTorus()
    }
}

function addPlane() {
    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const planeMesh = new THREE.Mesh(planeGeometry, defaultMaterial);

    addObjectToScene(planeMesh);

    useEditorStore.getState().addObject({
        id: uuid(),
        name: "Plane",
        type: "PRIMITIVE",
        object: planeMesh,
        transformations: {
            position: { x: planeMesh.position.x, y: planeMesh.position.y, z: planeMesh.position.z },
            rotation: { x: planeMesh.rotation.x, y: planeMesh.rotation.y, z: planeMesh.rotation.z },
            scale: { x: planeMesh.scale.x, y: planeMesh.scale.y, z: planeMesh.scale.z }
        }
    })
}

function addCube() {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMesh = new THREE.Mesh(cubeGeometry, defaultMaterial);

    addObjectToScene(cubeMesh);

    useEditorStore.getState().addObject({
        id: uuid(),
        name: "Cube",
        type: "PRIMITIVE",
        object: cubeMesh,
        transformations: {
            position: { x: cubeMesh.position.x, y: cubeMesh.position.y, z: cubeMesh.position.z },
            rotation: { x: cubeMesh.rotation.x, y: cubeMesh.rotation.y, z: cubeMesh.rotation.z },
            scale: { x: cubeMesh.scale.x, y: cubeMesh.scale.y, z: cubeMesh.scale.z }
        }
    });
}

function addCircle() {
    const circleGeometry = new THREE.CircleGeometry(1, 30);
    const circleMesh = new THREE.Mesh(circleGeometry, defaultMaterial);

    addObjectToScene(circleMesh);

    useEditorStore.getState().addObject({
        id: uuid(),
        name: "Circle",
        type: "PRIMITIVE",
        object: circleMesh,
        transformations: {
            position: { x: circleMesh.position.x, y: circleMesh.position.y, z: circleMesh.position.z },
            rotation: { x: circleMesh.rotation.x, y: circleMesh.rotation.y, z: circleMesh.rotation.z },
            scale: { x: circleMesh.scale.x, y: circleMesh.scale.y, z: circleMesh.scale.z }
        }
    });
}

function addSphere() {
    const sphereGeometry = new THREE.SphereGeometry(1, 30, 30);
    const sphereMesh = new THREE.Mesh(sphereGeometry, defaultMaterial);

    addObjectToScene(sphereMesh);

    useEditorStore.getState().addObject({
        id: uuid(),
        name: "Sphere",
        type: "PRIMITIVE",
        object: sphereMesh,
        transformations: {
            position: { x: sphereMesh.position.x, y: sphereMesh.position.y, z: sphereMesh.position.z },
            rotation: { x: sphereMesh.rotation.x, y: sphereMesh.rotation.y, z: sphereMesh.rotation.z },
            scale: { x: sphereMesh.scale.x, y: sphereMesh.scale.y, z: sphereMesh.scale.z }
        }
    });
}

function addCylinder() {
    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 30);
    const cylinderMesh = new THREE.Mesh(cylinderGeometry, defaultMaterial);

    addObjectToScene(cylinderMesh);

    useEditorStore.getState().addObject({
        id: uuid(),
        name: "Cylinder",
        type: "PRIMITIVE",
        object: cylinderMesh,
        transformations: {
            position: { x: cylinderMesh.position.x, y: cylinderMesh.position.y, z: cylinderMesh.position.z },
            rotation: { x: cylinderMesh.rotation.x, y: cylinderMesh.rotation.y, z: cylinderMesh.rotation.z },
            scale: { x: cylinderMesh.scale.x, y: cylinderMesh.scale.y, z: cylinderMesh.scale.z }
        }
    });
}

function addCone() {
    const coneGeometry = new THREE.ConeGeometry(1, 1, 30);
    const coneMesh = new THREE.Mesh(coneGeometry, defaultMaterial);

    addObjectToScene(coneMesh);

    useEditorStore.getState().addObject({
        id: uuid(),
        name: "Cone",
        type: "PRIMITIVE",
        object: coneMesh,
        transformations: {
            position: { x: coneMesh.position.x, y: coneMesh.position.y, z: coneMesh.position.z },
            rotation: { x: coneMesh.rotation.x, y: coneMesh.rotation.y, z: coneMesh.rotation.z },
            scale: { x: coneMesh.scale.x, y: coneMesh.scale.y, z: coneMesh.scale.z }
        }
    });
}

function addTorus() {
    const torusGeometry = new THREE.TorusGeometry(1, 1, 30);
    const torusMesh = new THREE.Mesh(torusGeometry, defaultMaterial);

    addObjectToScene(torusMesh);

    useEditorStore.getState().addObject({
        id: uuid(),
        name: "Torus",
        type: "PRIMITIVE",
        object: torusMesh,
        transformations: {
            position: { x: torusMesh.position.x, y: torusMesh.position.y, z: torusMesh.position.z },
            rotation: { x: torusMesh.rotation.x, y: torusMesh.rotation.y, z: torusMesh.rotation.z },
            scale: { x: torusMesh.scale.x, y: torusMesh.scale.y, z: torusMesh.scale.z }
        }
    });
}

