import { Move3D, Rotate3D, Scale3D } from "lucide-react"

const TransformationModes = () => {
  return (
    <div className="switch-panel">
        <Move3D className="switch-panel-icon"/>
        <div className="switch-panel-horizontal-separator"></div>
        <Rotate3D className="switch-panel-icon"/>
        <div className="switch-panel-horizontal-separator"></div>
        <Scale3D className="switch-panel-icon"/>
    </div>
  )
}

export default TransformationModes