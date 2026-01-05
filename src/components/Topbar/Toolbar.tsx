import { useEditorStore } from "../../store/editorStore";
import Home from "./Categories/Home"
import Tools from "./Categories/Tools"

const Toolbar = () => {
  const stateToolMode = useEditorStore((s) => s.activeCategory);

  return (
    <div>
      {stateToolMode === "HOME" && <Home/>}
      {stateToolMode === "TOOLS" && <Tools/>}
    </div>
  )
}

export default Toolbar