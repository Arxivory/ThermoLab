import { useEditorStore } from "../../store/editorStore";
import Geometries from "./Geometries";

const ModalRoot = () => {
    const activeModal = useEditorStore((s) => s.activeModal);

    if (activeModal === "NONE") return null;

    return (
        <div className="modal-overlay">
            {activeModal === "GEOMETRY" && <Geometries/>}
        </div>
    )
}

export default ModalRoot