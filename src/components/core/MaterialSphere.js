import * as THREE from "three"

export function initSphere(canvas) {
    materialSphere(canvas);
}

function materialSphere(canvas) {
    let scene, camera, renderer;
    let width, height;

    function init() {
        width = canvas.clientWidth;
        height = canvas.clientHeight;

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
        camera.position.set(0, 0, 5.5);

        renderer = new THREE.WebGLRenderer({
            canvas, antialias: true, alpha: true
        });
        renderer.setSize(width, height, false);
        renderer.setClearColor(0x000000, 0);
    }

    function createSphere() {
        const geometry = new THREE.SphereGeometry( 2.5, 32, 32 );
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.41,
            reflectivity: 9
        });
        const sphere = new THREE.Mesh( geometry, material );

        return sphere;
    }

    function createLighting() {
        const dirLight = new THREE.PointLight(0xffffff, 1);
        dirLight.position.set(2, 3, 3);
        scene.add(dirLight);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);
    }

    init();

    createLighting();

    scene.add(createSphere());
    renderer.render(scene, camera);
}