import { useEffect, useState } from "react";
import { useEditorStore } from "../../store/editorStore";

const Transformations = () => {
    const selectedObjectId = useEditorStore((s) => s.selectedObjectId);

    const sceneObject = useEditorStore((s) =>
        selectedObjectId ? s.objects[selectedObjectId] : null
    );
    
    const object = sceneObject?.object;

    const [values, setValues] = useState({
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
    });

    const handleChange = (sectionKey: string, dimensionKey: string, newValue) => {
        setValues((prev) => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                [dimensionKey]: Number(newValue)
            }
        }));
    }

    useEffect(() => {
        if (!object) return;

        setValues({
            position: {
                x: object.position.x,
                y: object.position.y,
                z: object.position.z
            },
            rotation: {
                x: object.rotation.x,
                y: object.rotation.y,
                z: object.rotation.z
            },
            scale: {
                x: object.scale.x,
                y: object.scale.y,
                z: object.scale.z
            }
        })
    }, [object]);

    useEffect(() => {
        if (!object) return;

        object.position.set(
            values.position.x,
            values.position.y,
            values.position.z
        );

        object.rotation.set(
            values.rotation.x,
            values.rotation.y,
            values.rotation.z
        );

        object.scale.set(
            values.scale.x,
            values.scale.y,
            values.scale.z
        );
    }, [object, values]);

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