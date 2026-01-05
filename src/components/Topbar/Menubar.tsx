import { useState } from "react";
import { useEditorStore } from "../../store/editorStore";


const Menubar = () => {
    const [isActive, setActivity] = useState(true);

    const toggleActivity = () => {
        setActivity(!isActive);
    }

    const setStateToolMode = useEditorStore((s) => s.setActiveCategory);

    return (
        <menu className="menu-bar">
            <nav className="menu-item">
                Menu
            </nav>
            <nav className={`menu-item ${isActive && 'active'}`}
            onClick={() => {
                    toggleActivity()
                    setStateToolMode("HOME")
                }}>
                Home
            </nav>
            <nav className={`menu-item ${!isActive && 'active'}`}
            onClick={() => {
                    toggleActivity()
                    setStateToolMode("TOOLS")
                }}>
                Tools
            </nav>
        </menu>
    )
}

export default Menubar