import { useEffect, type RefObject } from "react"
import { initRenderer } from './core/renderer'

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

const Workspace = ({canvasRef}: Props) => {
  
  useEffect(() => {
    if (!canvasRef.current) return
    initRenderer(canvasRef.current)
  }, [canvasRef])

  return (
    <div className="workspace panel">
      <canvas ref={canvasRef} className="workspace-canvas"></canvas>
    </div>
  )
}

export default Workspace