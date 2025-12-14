import * as THREE from "three"
import { getScene } from "./sceneAccess"

export function setupDefaultScene() {
  const scene = getScene()

  const light = new THREE.PointLight(0xffffff, 1)
  light.position.set(5, 5, 5)

  const ambient = new THREE.AmbientLight(0xffffff, 0.5)

  scene.add(light, ambient)

  const grid = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
  grid.name = "grid"
  scene.add(grid)
}
