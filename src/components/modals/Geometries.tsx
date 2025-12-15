import { Box, Circle, Cone, Cylinder, Globe, Square, Torus } from "lucide-react";
import { useEditorStore } from "../../store/editorStore";
import { executeEditorAction } from "../../editor/editor";

const Geometries = () => {
    const closeModal = useEditorStore((s) => s.closeModal);

    const handleClick = (action: string) => {
        executeEditorAction(action as any);
        closeModal();
    }

    const geometries = [
        {
            key: "plane",
            icon: Square,
            label: "Plane",
            action: "ADD_PLANE"
        },
        {
            key: "cube",
            icon: Box,
            label: "Cube",
            action: "ADD_CUBE"
        },
        {
            key: "circle",
            icon: Circle,
            label: "Circle",
            action: "ADD_CIRCLE"
        },
        {
            key: "sphere",
            icon: Globe,
            label: "Sphere",
            action: "ADD_SPHERE"
        },
        {
            key: "cylinder",
            icon: Cylinder,
            label: "Cyliner",
            action: "ADD_CYLINDER"
        },
        {
            key: "cone",
            icon: Cone,
            label: "Cone",
            action: "ADD_CONE"
        },
        {
            key: "torus",
            icon: Torus,
            label: "Torus",
            action: "ADD_TORUS"
        }
    ];

    return (
        <div className="modal">
            <span className="modal-title">Geometries</span>
            <div className="modal-separator"></div>
            <div className="modal-items-container">
                {geometries.map((geometry, index) => (
                    <div className="modal-item" 
                        key={index}
                        onClick={() => handleClick(geometry.action)}
                    >
                        <geometry.icon className="modal-item-icon"/>
                        <span className="modal-item-label">{geometry.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Geometries