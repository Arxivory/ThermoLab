import { Move3D, Rotate3D, Scale3D } from "lucide-react"
import { useEditorStore } from "../store/editorStore"

const TransformationModes = () => {
    const setTransformMode = useEditorStore(state => state.setTransformMode);

  return (
    <div className="switch-panel">
        <Move3D className="switch-panel-icon"
            onClick={() => setTransformMode("TRANSLATE")}
        />
        <div className="switch-panel-horizontal-separator"></div>
        <Rotate3D className="switch-panel-icon"
            onClick={() => setTransformMode("ROTATE")}
        />
        <div className="switch-panel-horizontal-separator"></div>
        <Scale3D className="switch-panel-icon"
            onClick={() => setTransformMode("SCALE")}
        />
    </div>
  )
}

export default TransformationModes