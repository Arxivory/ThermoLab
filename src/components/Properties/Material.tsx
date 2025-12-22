import { useEffect, useState } from "react";
import { useEditorStore } from "../../store/editorStore";

const Material = () => {
    const materialData = [
        {
            key: "density",
            label: "Density",
            symbol: "\u03C1",
            placeHolder: "Enter Density value...",
            inputType: "number"
        },
        {
            key: "elasticModulus",
            label: "Elastic Modulus",
            symbol: "E",
            placeHolder: "Enter Elastic Modulus value...",
            inputType: "number"
        },
        {
            key: "specificHeat",
            label: "Specific Heat",
            symbol: "c",
            placeHolder: "Enter Specific Heat value...",
            inputType: "number"
        },
        {
            key: "thermalConductivity",
            label: "Thermal Conductivity",
            symbol: "k",
            placeHolder: "Enter Thermal Conductivity value...",
            inputType: "number"
        },
        {
            key: "emissivity",
            label: "Emissivity",
            symbol: "\u03B5",
            placeHolder: "Enter Emissivity value...",
            inputType: "number"
        },
        {
            key: "absorptivity",
            label: "Absorptivity",
            symbol: "\u03B1",
            placeHolder: "Enter Absorptivity value...",
            inputType: "number"
        },
    ];

    const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
    const updateObjectMaterial = useEditorStore((s) => s.updateObjectMaterial);

    const currentMaterial = useEditorStore((s) =>
        selectedObjectId ? s.objects[selectedObjectId]?.material : null
    );

    const [material, setMaterial] = useState({
        density: 2000,
        specificHeat: 1000,
        thermalConductivity: 10,
        elasticModulus: 1e9,
        emissivity: 0.8,
        absorptivity: 0.8
    });

    useEffect(() => {
        if (!(currentMaterial && selectedObjectId)) return;

        setMaterial({ ...currentMaterial });

    }, [currentMaterial]);

    const handleChange = (
        input: string,
        newVal: string
    ) => {
        if (!selectedObjectId) return;

        const next = {
            ...material,
            [input]: Number(newVal)
        };

        setMaterial(next);

        updateObjectMaterial(selectedObjectId, next);
    };

  return (
    <div className="subpanel">
        <span className="subpanel-title">Material</span>

        <div className="subpanel-container material">
            {materialData.map((input, index) => (
                <div className="property" key={index}>
                    <span className="property-name">
                        {`${input.label} (${input.symbol}):`}
                    </span>
                    <input type={input.inputType} 
                        placeholder={input.placeHolder} 
                        value={material[input.key]}
                        step={0.1}
                        className="property-input" 
                        onChange={(e) => handleChange(input.key, e.target.value)}
                    />
                </div>
            ))}
        </div>
    </div>
  )
}

export default Material