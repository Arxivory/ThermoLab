import { getTransformControls } from "./gizmos/transformControls";
import { getRenderer, getScene, getCamera, getControls } from "./sceneAccess"

let animationId: number | null = null

export function startRenderLoop() {
  function loop() {
    animationId = requestAnimationFrame(loop)
    getControls().update();
    getTransformControls().update();
    getRenderer().render(getScene(), getCamera())
  }

  loop()
}

export function stopRenderLoop() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}
