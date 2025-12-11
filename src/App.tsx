import './App.css'
import './index.css'
import Topbar from './components/Topbar/Topbar'
import ObjectList from './components/ObjectList'
import Properties from './components/Properties'
import Workspace from './components/Workspace'

function App() {

  return (
    <>
      <div className="parent">
        <Topbar/>
        <ObjectList/>
        <Properties/>
        <Workspace/>
      </div>
    </>
  )
}

export default App
