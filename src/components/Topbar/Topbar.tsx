import Toolbar from "./Toolbar"

interface Props {
  mode: string;
}

const Topbar = ({mode}: Props) => {
  return (
    <div className="topbar panel">
      <Toolbar toolMode={mode}/>
    </div>
  )
}

export default Topbar