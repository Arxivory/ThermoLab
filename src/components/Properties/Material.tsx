const Material = () => {
  return (
    <div className="subpanel">
        <span className="subpanel-title">Material</span>

        <div className="subpanel-container material">
            <div className="property">
                <span className="property-name">
                    Density (ρ):
                </span>
                <input type="text" placeholder="Enter Transparency..." className="property-input" />
            </div>
            <div className="property">
                <span className="property-name">
                    Elastic Modulus (E):
                </span>
                <input type="text" placeholder="Enter Elastic Modulus..." className="property-input" />
            </div>
            <div className="property">
                <span className="property-name">
                    Specific Heat (c):
                </span>
                <input type="text" placeholder="Enter Specific Heat..." className="property-input" />
            </div>
            <div className="property">
                <span className="property-name">
                    Thermal Conductivity (k):
                </span>
                <input type="text" placeholder="Enter Thermal Conductivity..." className="property-input" />
            </div>
            <div className="property">
                <span className="property-name">
                    Emissivity (ε):
                </span>
                <input type="text" placeholder="Enter Emissivity..." className="property-input" />
            </div>
            <div className="property">
                <span className="property-name">
                    Absorptivity (α):
                </span>
                <input type="text" placeholder="Enter Absorptivity..." className="property-input" />
            </div>
        </div>
    </div>
  )
}

export default Material