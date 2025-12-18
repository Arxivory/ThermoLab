import { useState } from "react";

const Transformations = () => {
    const [values, setValues] = useState({
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0, y: 0, z: 0 }
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