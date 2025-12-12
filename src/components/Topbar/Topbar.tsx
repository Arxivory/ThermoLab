import Menubar from "./Menubar"
import Toolbar from "./Toolbar"

const Topbar = () => {
  return (
    <div className="topbar panel">
      <Menubar/>
      <Toolbar/>
    </div>
  )
}

export default Topbar