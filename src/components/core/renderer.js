import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js";


export function initRenderer(canvas) {
    render3DSpace(canvas);
}

function render3DSpace(canvas) {
    let scene, renderer, camera, controls;
    let fov = 45;
    let width, height;

    function init() {
        width = canvas.clientWidth;
        height = canvas.clientHeight;

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
        camera.position.set(3, 3, 3);

        renderer = new THREE.WebGLRenderer({
            canvas, 
            antialias: true,
            alpha: true
        })

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(width, height, true);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
    }

    function setupLighting() {
        const dir = new THREE.PointLight(0xffffff, 1);
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(dir);
        scene.add(ambient);
    }

    function setupGrid() {
        const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        scene.add(gridHelper);
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);

    }

    init();
    setupLighting();
    setupGrid();

    animate();

}