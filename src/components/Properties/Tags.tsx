import { ChevronRight, X } from "lucide-react"
import { useEditorStore } from "../../store/editorStore";

const Tags = () => {
    const tagsData = [
        {
            id: "fixed-temperature",
            name: "Fixed Temperature"
        },
        {
            id: "heat-flux",
            name: "Heat Flux"
        },
        {
            id: "insulation",
            name: "Insulation"
        },
        {
            id: "angular-velocity",
            name: "Fixed Temperature"
        },
        {
            id: "linear-velocity",
            name: "Linear Velocity"
        },
    ]

    
    const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
    const tools = useEditorStore(s => s.tools);

    const objectTools = Object.values(tools).filter(
        t => t.target.kind === "OBJECT" && t.target.id === selectedObjectId
    );

  return (
    <div className="subpanel">
        <span className="subpanel-title">Tags</span>

        <div className="subpanel-container material">
            {objectTools.map(tool => (
                <div className="tag" key={tool.id}>
                    <div className="tag-wrapper">
                    <ChevronRight
                        className="tag-icon"
                    />
                    <span className="tag-name">
                        {tool.type}
                    </span>
                    </div>
                    <X className="tag-icon"/>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Tags