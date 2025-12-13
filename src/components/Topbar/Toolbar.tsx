import Home from "./Categories/Home"
import Tools from "./Categories/Tools"

interface Props {
  toolMode: string;
}

const Toolbar = ({toolMode}: Props) => {
  return (
    <div>
      {toolMode === "Home" && <Home/>}
      {toolMode === "Tools" && <Tools/>}
    </div>
  )
}

export default Toolbar