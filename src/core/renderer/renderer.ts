import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { setupDefaultScene } from "./setupDefaultScene"
import { startRenderLoop } from "./renderLoop"
import { setRendererContext } from "./sceneAccess"
import { onCanvasClick } from "./raycaster"
import { initTransformControls } from "./gizmos/transformControls"
import { initSceneTransformSync } from "./sync/transformSync"
import { initAppearanceSync } from "./sync/appearanceSync"

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let width: number
let height: number

let animationId: number | null = null

export function initRenderer(canvas: HTMLCanvasElement) {
  width = canvas.clientWidth
  height = canvas.clientHeight

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(15, width / height, 0.1, 1000)
  camera.position.set(10, 10, 10)

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  })

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  setRendererContext({scene, camera, renderer, controls})

  setupDefaultScene()

  initTransformControls()

  initSceneTransformSync()

  initAppearanceSync();

  canvas.addEventListener("pointerdown", onCanvasClick);

  startRenderLoop()

  return {
    scene,
    camera,
    renderer,
  }
}
