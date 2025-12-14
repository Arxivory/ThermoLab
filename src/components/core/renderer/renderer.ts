import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { setupDefaultScene } from "./setupDefaultScene"
import { startRenderLoop } from "./renderLoop"
import { setRendererContext } from "./sceneAccess"

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls

let animationId: number | null = null

export function initRenderer(canvas: HTMLCanvasElement) {
  const width = canvas.clientWidth
  const height = canvas.clientHeight

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(3, 3, 3)

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
  startRenderLoop()

  return {
    scene,
    camera,
    renderer,
  }
}
