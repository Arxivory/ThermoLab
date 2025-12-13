import { useEffect, useRef } from 'react';
import { initSphere } from '../core/MaterialSphere';

const Appearance = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        initSphere(canvasRef.current);
    })

  return (
    <div className="subpanel">
        <span className="subpanel-title">Appearance</span>

        <div className="subpanel-container appearance">
            <div className="wrapper">
                <canvas ref={canvasRef} id="material-preview-canvas" className="material-preview-canvas"></canvas>
                <div className="appearance-inputs-wrapper">
                    <div className="property">
                        <span className="property-name">
                            Color:
                        </span>
                        <input type="text" placeholder="Enter Color..." className="property-input" />
                    </div>
                    <div className="property">
                        <span className="property-name">
                            Roughness:
                        </span>
                        <input type="text" placeholder="Enter Roughness..." className="property-input" />
                    </div>
                    <div className="property">
                        <span className="property-name">
                            Metalness:
                        </span>
                        <input type="text" placeholder="Enter Metalness..." className="property-input" />
                    </div>
                </div>
            </div>
            <div className="property">
                <span className="property-name">
                    Transparency:
                </span>
                <input type="text" placeholder="Enter Transparency..." className="property-input" />
            </div>
            <div className="property">
                <span className="property-name">
                    Texture:
                </span>
                <input type="text" placeholder="Enter Texture..." className="property-input" />
            </div>
        </div>
    </div>
  )
}

export default Appearance