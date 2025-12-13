const Transformations = () => {
  return (
    <div className="subpanel">
        <span className="subpanel-title">Transformations</span>

        <div className="subpanel-container">
            <div className="transformation">
                <div className="transformation-title">
                    Position
                </div>
                <div className="transformation-inputs">
                    <input type="number" placeholder="X" className="transformation-dimension" />
                    <input type="number" placeholder="Y" className="transformation-dimension" />
                    <input type="number" placeholder="Z" className="transformation-dimension" />
                </div>
            </div>

            <div className="transformation">
                <div className="transformation-title">
                    Rotation
                </div>
                <div className="transformation-inputs">
                    <input type="number" placeholder="X" className="transformation-dimension" />
                    <input type="number" placeholder="Y" className="transformation-dimension" />
                    <input type="number" placeholder="Z" className="transformation-dimension" />
                </div>
            </div>

            <div className="transformation">
                <div className="transformation-title">
                    Scale
                </div>
                <div className="transformation-inputs">
                    <input type="number" placeholder="X" className="transformation-dimension" />
                    <input type="number" placeholder="Y" className="transformation-dimension" />
                    <input type="number" placeholder="Z" className="transformation-dimension" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Transformations