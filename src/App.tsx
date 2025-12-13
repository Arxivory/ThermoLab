import './App.css'
import './index.css'
import Topbar from './components/Topbar/Topbar'
import ObjectList from './components/ObjectList'
import Properties from './components/Properties/Properties'
import Workspace from './components/Workspace'
import Menubar from './components/Topbar/Menubar'
import { useState } from 'react'

function App() {
  const [toolMode, setToolMode] = useState("Home");

  return (
    <>
      <Menubar setToolMode={setToolMode}/>
      <div className="parent">
        <Topbar mode={toolMode}/>
        <ObjectList/>
        <Properties/>
        <Workspace/>
      </div>
    </>
  )
}

export default App
