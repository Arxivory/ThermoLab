import Transformations from "./Transformations"
import Appearance from "./Appearance"
import Material from "./Material"
import Tags from "./Tags"

const Properties = () => {
  return (
    <div className="properties panel">
      <span className="panel-title">
        Properties
      </span>
      <div className="panel-horizontal-separator"></div>
      <div className="panel-container">
        <Transformations/>
        <div className="panel-horizontal-separator"></div>
        <Appearance/>
        <div className="panel-horizontal-separator"></div>
        <Material/>
        <div className="panel-horizontal-separator"></div>
        <Tags/>
      </div>
    </div>
  )
}

export default Properties