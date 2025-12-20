import { useEffect, useRef } from 'react';
import { initSphere } from '../core/MaterialSphere';

const Appearance = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        initSphere(canvasRef.current);
    })

    const appearanceWrapperData = [
        {
            key: "color",
            label: "Color",
            placeHolder: "Enter Color value...",
            inputType: "color"
        },
        {
            key: "roughness",
            label: "Roughness",
            placeHolder: "Enter Roughness value...",
            inputType: "number"
        },
        {
            key: "metalness",
            label: "Metalness",
            placeHolder: "Enter Metalness value...",
            inputType: "number"
        }
    ]

    const appearanceData = [
        {
            key: "reflectivity",
            label: "Reflectivity",
            placeHolder: "Enter Reflectivity value...",
            inputType: "number"
        },
        {
            key: "opacity",
            label: "Opacity",
            placeHolder: "Enter Opacity value...",
            inputType: "number"
        },
        {
            key: "texture",
            label: "Texture",
            placeHolder: "Enter Texture...",
            inputType: "file"
        }
    ]

  return (
    <div className="subpanel">
        <span className="subpanel-title">Appearance</span>

        <div className="subpanel-container appearance">
            <div className="wrapper">
                <canvas ref={canvasRef} id="material-preview-canvas" className="material-preview-canvas"></canvas>
                <div className="appearance-inputs-wrapper">
                    {appearanceWrapperData.map((input, index) => (
                        <div className="property" key={index}>
                            <span className="property-name">
                                {`${input.label}: `}
                            </span>
                            <input type={input.inputType} placeholder={input.placeHolder} className="property-input" />
                        </div>
                    ))}
                </div>
            </div>
            {appearanceData.map((input, index) => (
                <div className="property" key={index}>
                    <span className="property-name">
                        {`${input.label}: `}
                    </span>
                    <input type={input.inputType} placeholder={input.placeHolder} className="property-input" />
                </div>
            ))}
        </div>
    </div>
  )
}

export default Appearance