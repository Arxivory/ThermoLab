import { useState } from "react";

interface Props {
    setToolMode: (mode: string) => void;
}

const Menubar = ({setToolMode}: Props) => {
    const [isActive, setActivity] = useState(true);

    const toggleActivity = () => {
        setActivity(!isActive);
    }

    return (
        <menu className="menu-bar">
            <nav className="menu-item">
                Menu
            </nav>
            <nav className={`menu-item ${isActive && 'active'}`}
            onClick={() => {
                    toggleActivity()
                    setToolMode("Home")
                }}>
                Home
            </nav>
            <nav className={`menu-item ${!isActive && 'active'}`}
            onClick={() => {
                    toggleActivity()
                    setToolMode("Tools")
                }}>
                Tools
            </nav>
        </menu>
    )
}

export default Menubar