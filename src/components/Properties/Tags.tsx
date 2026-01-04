import { ChevronRight, X } from "lucide-react"
import { useEditorStore } from "../../store/editorStore";
import { useState } from "react";

const Tags = () => {
    
    const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
    const tools = useEditorStore(s => s.tools);

    const objectTools = Object.values(tools).filter(
        t => t.target.kind === "OBJECT" && t.target.id === selectedObjectId
    );

    const [paramsVisible, setParamsVisible] = useState(false);

  return (
    <div className="subpanel">
        <span className="subpanel-title">Tags</span>

        <div className="subpanel-container material">
            {objectTools.map(tool => (
                <div className="tag-container">
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
                    {paramsVisible && Object.entries(tool.parameters).map(([key, value]) => (
                        <div className="params-container" key={key}> 
                            <span className="property-name">
                                {`${key}: `}
                            </span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
  )
}

export default Tags