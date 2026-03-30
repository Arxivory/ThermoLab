import { useEffect, type RefObject } from "react"
import { initRenderer } from "../core/renderer/renderer"
import ThermalLegend from "./ThermalLegend"

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

const Workspace = ({canvasRef}: Props) => {
  
  useEffect(() => {
    if (!canvasRef.current) return

    initRenderer(canvasRef.current);
  }, [canvasRef])

  return (
    <div className="workspace panel">
      <canvas ref={canvasRef} className="workspace-canvas"></canvas>
      <ThermalLegend />
    </div>
  )
}

export default Workspace