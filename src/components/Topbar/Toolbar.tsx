import { useEditorStore } from "../../store/editorStore";
import Home from "./Categories/Home"
import Tools from "./Categories/Tools"

interface Props {
  toolMode: string;
}

const Toolbar = ({toolMode}: Props) => {
  const stateToolMode = useEditorStore((s) => s.activeCategory);

  return (
    <div>
      {stateToolMode === "HOME" && <Home/>}
      {stateToolMode === "TOOLS" && <Tools/>}
    </div>
  )
}

export default Toolbar