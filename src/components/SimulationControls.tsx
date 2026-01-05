import { Play, Pause, Square } from "lucide-react";
import { useEditorStore } from "../store/editorStore";
import { SimulationManager } from "../core/simulation/SimulationManager";
import { useRef } from "react";

const SimulationControls = () => {
  const editorState = useEditorStore((s) => s);
  const simulationManagerRef = useRef(new SimulationManager());
  const simulationManager = simulationManagerRef.current;

  const play = () => {
    simulationManager.start(editorState);
  }

  const stop = () => {
    simulationManager.stop();
  }


  return (
    <div className="switch-panel horizontal">
        <Play className="switch-panel-icon" onClick={play}/>
        <div className="switch-panel-vertical-separator"></div>
        <Pause className="switch-panel-icon"/>
        <div className="switch-panel-vertical-separator"></div>
        <Square className="switch-panel-icon" onClick={stop}/>
    </div>
  )
}

export default SimulationControls