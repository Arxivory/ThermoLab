import { useEffect, useState } from "react";
import { useEditorStore } from "../../store/editorStore";

const Transformations = () => {
    const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
    const updateObjectTransform = useEditorStore((s) => s.updateObjectTransform);
    
    const transform = useEditorStore((s) =>
        selectedObjectId ? s.objects[selectedObjectId]?.transformations : null
    );

    const [values, setValues] = useState({
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
    });

    useEffect(() => {
        if (!transform) return;
        setValues({
            position: transform.position,
            rotation: {
                x: transform.rotation.x * (180 / Math.PI),
                y: transform.rotation.y * (180 / Math.PI),
                z: transform.rotation.z * (180 / Math.PI)
            },
            scale: transform.scale
        });
    }, [transform]);

    const handleChange = (
        sectionKey: "position" | "rotation" | "scale",
        dimensionKey: "x" | "y" | "z",
        newValue: string
    ) => {
        if (!selectedObjectId) return;

        const newVal = Number(newValue);

        const next = {
            ...values,
            [sectionKey]: {
                ...values[sectionKey],
                [dimensionKey]: 
                    sectionKey === "rotation" ? 
                    (newVal * (Math.PI / 180)) : 
                    newVal
            }
        };

        setValues({
            ...values,
            [sectionKey]: {
                ...values[sectionKey],
                [dimensionKey]: newVal
            }
        });

        updateObjectTransform(selectedObjectId, next);
    };


    const transformationsPanelData = [
        {
            key: "position",
            title: "Position",
            dimensions: [
                { key: "x", label: "X"},
                { key: "y", label: "Y"},
                { key: "z", label: "Z"},
            ]
        },
        {
            key: "rotation",
            title: "Rotation",
            dimensions: [
                { key: "x", label: "X"},
                { key: "y", label: "Y"},
                { key: "z", label: "Z"},
            ]
        },
        {
            key: "scale",
            title: "Scale",
            dimensions: [
                { key: "x", label: "X"},
                { key: "y", label: "Y"},
                { key: "z", label: "Z"},
            ]
        }
    ];


  return (
    <div className="subpanel">
        <span className="subpanel-title">Transformations</span>
        <div className="subpanel-container">
            {transformationsPanelData.map((section, index) => (
                <div className="transformation" key={index}>
                    <div className="transformation-title">
                        {section.title}
                    </div>
                    <div className="transformation-inputs">
                        {section.dimensions.map((dimension, i) => (
                            <input type="number" placeholder={dimension.label} 
                                className="transformation-dimension"
                                key={i}
                                value={values[section.key][dimension.key]}
                                onChange={(e) => handleChange(section.key, dimension.key, e.target.value)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Transformations