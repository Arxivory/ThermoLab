import { useEffect, useRef } from "react"
import { initRenderer } from './core/renderer'

const Workspace = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
      if (!canvasRef.current) return;

      initRenderer(canvasRef.current);
  })

  return (
    <div className="workspace panel">
      <canvas ref={canvasRef} className="workspace-canvas"></canvas>
    </div>
  )
}

export default Workspace