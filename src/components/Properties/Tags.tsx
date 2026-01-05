import { ChevronRight, X } from "lucide-react"
import { useEditorStore } from "../../store/editorStore";
import { useState } from "react";
import { updateToolParameters } from "../../editor/tools/updateToolParameter";

const ParameterInput = ({ name, value, onChange }: {
    name: string;
    value: any;
    onChange: (val: any) => void;
}) => {
    if (typeof value === "number") {
        return (
            <input type="number" 
                value={value}
                className="property-input" 
                onChange={(e) => onChange(Number(e.target.value))}
            />
        )
    }

    if (typeof value === "string") {
        const options = [
            "LOCAL",
            "WORLD",
            "SURFACE",
            "VOLUME",
            "IN",
            "OUT",
            "UNIFORM",
            "RADIAL"
        ]

        const enumOptions = options.filter(opt => opt === value || name.toUpperCase().includes(opt));

        return enumOptions.length ? (
            <select 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="property-input"
            >
                {enumOptions.map(opt => (
                    <option key={opt} 
                        value={opt} 
                        className="property-input-option"
                        onChange={(e) => e.t}
                    ></option>
                ))}
            </select>
        ) : (
            <input type="text" 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                className="property-input" 
            />
        )
    }

    if (typeof value === "object") {
        return (
            <div className="param-object">
                {Object.entries(value).map(([k, v]) => (
                <div key={k} className="property-input">
                    <span className="property-name">{k}: </span>
                    <ParameterInput
                    name={k}
                    value={v}
                    onChange={(newVal) => onChange({ ...value, [k]: newVal })}
                    />
                </div>
                ))}
            </div>
        );
    }
}

const Tags = () => {
    
    const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
    const tools = useEditorStore(s => s.tools);
    const updateTool = useEditorStore((s) => s.updateTool);

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
                                onClick={() => setParamsVisible(!paramsVisible)}
                            />
                            <span className="tag-name">
                                {tool.type}
                            </span>
                        </div>
                        <X className="tag-icon"/>
                    </div>
                    {paramsVisible && (
                        <div className="params-container">
                            {Object.entries(tool.parameters).map(([key, value]) => (
                                <div key={key} className="property">
                                    <span className="property-name">{key}: </span>
                                    <ParameterInput
                                        name={key}
                                        value={value}
                                        onChange={(newVal) => {
                                            updateTool(tool.id, (prev) =>
                                                updateToolParameters(prev, (params) => ({
                                                    ...params,
                                                    [key]: newVal
                                                }))
                                            )
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  )
}

export default Tags