import { Play, Pause, Square } from "lucide-react";

const SimulationControls = () => {
  return (
    <div className="switch-panel horizontal">
        <Play className="switch-panel-icon"/>
        <div className="switch-panel-vertical-separator"></div>
        <Pause className="switch-panel-icon"/>
        <div className="switch-panel-vertical-separator"></div>
        <Square className="switch-panel-icon"/>
    </div>
  )
}

export default SimulationControls