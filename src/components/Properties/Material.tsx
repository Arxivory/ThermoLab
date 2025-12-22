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

  return (
    <div className="subpanel">
        <span className="subpanel-title">Material</span>

        <div className="subpanel-container material">
            {materialData.map((input, index) => (
                <div className="property">
                    <span className="property-name">
                        {`${input.label} (${input.symbol}):`}
                    </span>
                    <input type={input.inputType} placeholder={input.placeHolder} className="property-input" />
                </div>
            ))}
        </div>
    </div>
  )
}

export default Material