import * as THREE from "three";
import { v4 as uuid } from "uuid";
import { useEditorStore } from "../../../store/editorStore";
import { addObjectToScene } from "../../../components/core/sceneController";
import { getEnvironmentMap } from "../../../components/core/renderer/environmentManager";
import { getRenderer } from "../../../components/core/renderer/sceneAccess";
import { toHexColor } from "../../../utils/colorDataConverters";

export async function addGeometry(geometryType: string) {

    const envMap = await getEnvironmentMap(getRenderer());

    switch (geometryType) {
        case "ADD_PLANE":
            return addPlane(envMap)
        case "ADD_CUBE":
            return addCube(envMap)
        case "ADD_CIRCLE":
            return addCircle(envMap)
        case "ADD_SPHERE":
            return addSphere(envMap)
        case "ADD_CYLINDER":
            return addCylinder(envMap)
        case "ADD_CONE":
            return addCone(envMap)
        case "ADD_TORUS":
            return addTorus(envMap)
    }
}

function createPrimitiveMaterial(envMap: THREE.Texture) {
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

function addPlane(envMap: THREE.Texture) {
    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const planeMesh = new THREE.Mesh(planeGeometry, createPrimitiveMaterial(envMap));

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
        },
        appearance: {
            color: toHexColor(planeMesh.material.color),
            roughness: planeMesh.material.roughness,
            metalness: planeMesh.material.metalness,
            reflectivity: planeMesh.material.reflectivity,
            opacity: planeMesh.material.opacity
        }
    })
}

function addCube(envMap: THREE.Texture) {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMesh = new THREE.Mesh(cubeGeometry, createPrimitiveMaterial(envMap));

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
        },
        appearance: {
            color: toHexColor(cubeMesh.material.color),
            roughness: cubeMesh.material.roughness,
            metalness: cubeMesh.material.metalness,
            reflectivity: cubeMesh.material.reflectivity,
            opacity: cubeMesh.material.opacity
        }
    });
}

function addCircle(envMap: THREE.Texture) {
    const circleGeometry = new THREE.CircleGeometry(1, 30);
    const circleMesh = new THREE.Mesh(circleGeometry, createPrimitiveMaterial(envMap));

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
        },
        appearance: {
            color: toHexColor(circleMesh.material.color),
            roughness: circleMesh.material.roughness,
            metalness: circleMesh.material.metalness,
            reflectivity: circleMesh.material.reflectivity,
            opacity: circleMesh.material.opacity
        }
    });
}

function addSphere(envMap: THREE.Texture) {
    const sphereGeometry = new THREE.SphereGeometry(1, 30, 30);
    const sphereMesh = new THREE.Mesh(sphereGeometry, createPrimitiveMaterial(envMap));

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
        },
        appearance: {
            color: toHexColor(sphereMesh.material.color),
            roughness: sphereMesh.material.roughness,
            metalness: sphereMesh.material.metalness,
            reflectivity: sphereMesh.material.reflectivity,
            opacity: sphereMesh.material.opacity
        }
    });
}

function addCylinder(envMap: THREE.Texture) {
    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 30);
    const cylinderMesh = new THREE.Mesh(cylinderGeometry, createPrimitiveMaterial(envMap));

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
        },
        appearance: {
            color: toHexColor(cylinderMesh.material.color),
            roughness: cylinderMesh.material.roughness,
            metalness: cylinderMesh.material.metalness,
            reflectivity: cylinderMesh.material.reflectivity,
            opacity: cylinderMesh.material.opacity
        }
    });
}

function addCone(envMap: THREE.Texture) {
    const coneGeometry = new THREE.ConeGeometry(1, 1, 30);
    const coneMesh = new THREE.Mesh(coneGeometry, createPrimitiveMaterial(envMap));

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
        },
        appearance: {
            color: toHexColor(coneMesh.material.color),
            roughness: coneMesh.material.roughness,
            metalness: coneMesh.material.metalness,
            reflectivity: coneMesh.material.reflectivity,
            opacity: coneMesh.material.opacity
        }
    });
}

function addTorus(envMap: THREE.Texture) {
    const torusGeometry = new THREE.TorusGeometry(1, 1, 30);
    const torusMesh = new THREE.Mesh(torusGeometry, createPrimitiveMaterial(envMap));

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
        },
        appearance: {
            color: toHexColor(torusMesh.material.color),
            roughness: torusMesh.material.roughness,
            metalness: torusMesh.material.metalness,
            reflectivity: torusMesh.material.reflectivity,
            opacity: torusMesh.material.opacity
        }
    });
}

