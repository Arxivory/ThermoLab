import { useEditorStore } from "../../store/editorStore";
import Geometries from "./Geometries";

const ModalRoot = () => {
    const activeModal = useEditorStore((s) => s.activeModal);
    const closeModal = useEditorStore((s) => s.closeModal);

    const handleClick = (e) => {
        if (e.target.className === "modal-overlay")
            closeModal();
    };

    if (activeModal === "NONE") return null;

    return (
        <div className="modal-overlay"
            onClick={handleClick}>
            {activeModal === "GEOMETRY" && <Geometries/>}
        </div>
    )
}

export default ModalRoot