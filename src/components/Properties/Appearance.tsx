import { useEffect, useRef, useState } from 'react';
import { initSphere } from '../core/MaterialSphere';
import { useEditorStore } from '../../store/editorStore';
import { toHexColor, toSceneColor } from '../../utils/colorDataConverters';

const Appearance = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        initSphere(canvasRef.current);
    }, []);

    const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
    const updateObjectMaterial = useEditorStore((s) => s.updateObjectMaterial);

    const currentAppearance = useEditorStore((s) =>
        selectedObjectId ? s.objects[selectedObjectId]?.appearance : null
    );

    const [appearance, setAppearance] = useState({
        color: "#ffffff",
        metalness: 0.78,
        roughness: 0.15,
        reflectivity: 0.3,
        opacity: 1.0
    });

    useEffect(() => {
        if (!currentAppearance) return;

        setAppearance({
            color: toHexColor(currentAppearance.color),
            metalness: currentAppearance.metalness,
            roughness: currentAppearance.roughness,
            reflectivity: currentAppearance.reflectivity,
            opacity: currentAppearance.opacity
        });
    });

    const handleChange = (
        input: string,
        newVal: string
    ) => {
        if (!selectedObjectId) return;

        const next = {
            ...appearance,
            [input]: input === "color" ? 
                toSceneColor(newVal) :
                Number(newVal)
        };

        setAppearance({
            ...appearance,
            [input]: input === "color" ?
                newVal :
                Number(newVal)
        })

        updateObjectMaterial(selectedObjectId, next);

    }

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
                            <input type={input.inputType} 
                                placeholder={input.placeHolder} 
                                value={appearance[input.key]}
                                className="property-input" 
                                onChange={(e) =>
                                    handleChange(input.key, e.target.value)
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>
            {appearanceData.map((input, index) => (
                <div className="property" key={index}>
                    <span className="property-name">
                        {`${input.label}: `}
                    </span>
                    <input type={input.inputType} 
                        placeholder={input.placeHolder} 
                        value={appearance[input.key]}
                        className="property-input" 
                        onChange={(e) => 
                            handleChange(input.key, e.target.value)
                        }
                    />
                </div>
            ))}
        </div>
    </div>
  )
}

export default Appearance