import { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { initMaterialPreview, updateMaterialPreview } from '../core/renderer/material/materialPreview';

const Appearance = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        initMaterialPreview(canvasRef.current);
    }, []);

    const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
    const updateObjectAppearance = useEditorStore((s) => s.updateObjectAppearance);

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
        if (!(currentAppearance && selectedObjectId)) return;

        setAppearance({
            color: currentAppearance.color,
            metalness: currentAppearance.metalness,
            roughness: currentAppearance.roughness,
            reflectivity: currentAppearance.reflectivity,
            opacity: currentAppearance.opacity
        });

        updateMaterialPreview(selectedObjectId);
    }, [currentAppearance]);

    const handleChange = (
        input: string,
        newVal: string
    ) => {
        if (!selectedObjectId) return;

        const next = {
            ...appearance,
            [input]: input === "color" ? 
                newVal :
                Number(newVal)
        };

        setAppearance({
            ...appearance,
            [input]: input === "color" ?
                newVal :
                Number(newVal)
        })

        updateObjectAppearance(selectedObjectId, next);
        updateMaterialPreview(selectedObjectId);

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
                                step={0.01}
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
                        step={0.01}
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