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
        position: planeMesh.position.clone(),
        rotation: planeMesh.rotation.clone(),
        scale: planeMesh.scale.clone()
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
        position: cubeMesh.position.clone(),
        rotation: cubeMesh.rotation.clone(),
        scale: cubeMesh.scale.clone()
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
        position: circleMesh.position.clone(),
        rotation: circleMesh.rotation.clone(),
        scale: circleMesh.scale.clone()
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
        position: sphereMesh.position.clone(),
        rotation: sphereMesh.rotation.clone(),
        scale: sphereMesh.scale.clone()
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
        position: cylinderMesh.position.clone(),
        rotation: cylinderMesh.rotation.clone(),
        scale: cylinderMesh.scale.clone()
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
        position: coneMesh.position.clone(),
        rotation: coneMesh.rotation.clone(),
        scale: coneMesh.scale.clone()
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
        position: torusMesh.position.clone(),
        rotation: torusMesh.rotation.clone(),
        scale: torusMesh.scale.clone()
    });
}

