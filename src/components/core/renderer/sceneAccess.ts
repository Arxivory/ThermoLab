import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

let scene: THREE.Scene | null = null
let camera: THREE.Camera | null = null
let renderer: THREE.WebGLRenderer | null = null
let controls: OrbitControls | null = null

export function setRendererContext(ctx: {
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
}) {
  scene = ctx.scene
  camera = ctx.camera
  renderer = ctx.renderer
  controls = ctx.controls
}

export function getScene() {
  if (!scene) throw new Error("Scene not initialized")
  return scene
}

export function getCamera() {
  if (!camera) throw new Error("Camera not initialized")
  return camera
}

export function getRenderer() {
  if (!renderer) throw new Error("Renderer not initialized")
  return renderer
}

export function getControls() {
    if (!controls) throw new Error("Controls not initialized")
    return controls
}
