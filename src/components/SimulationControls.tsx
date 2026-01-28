import { Play, Pause, Square, Lightbulb } from "lucide-react";
import { useEditorStore } from "../store/editorStore";
import { SimulationManager } from "../core/simulation/SimulationManager";
import { useRef, useState } from "react";

const SimulationControls = () => {
  const editorState = useEditorStore((s) => s);
  const simulationManagerRef = useRef(new SimulationManager());
  const simulationManager = simulationManagerRef.current;

  const [isRunning, setIsRunning] = useState(simulationManager.isRunning());

  const solve = () => {
    simulationManager.solve(editorState);
  }

  const play = () => {
    simulationManager.start(editorState);
    setIsRunning(simulationManager.isRunning());
  }

  const stop = () => {
    simulationManager.stop();
    setIsRunning(simulationManager.isRunning());
  }


  return (
    <div className="switch-panel horizontal">
        <Lightbulb className="switch-panel-icon" onClick={solve}/>
        <Play className={`switch-panel-icon ${isRunning && 'active'}`} onClick={play}/>
        <div className="switch-panel-vertical-separator"></div>
        <Pause className="switch-panel-icon"/>
        <div className="switch-panel-vertical-separator"></div>
        <Square className="switch-panel-icon" onClick={stop}/>
    </div>
  )
}

export default SimulationControls