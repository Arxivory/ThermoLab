import { AlarmSmoke, BrickWallFire, ChartLine, ChartNoAxesGantt, Database, FileText, Flame, MoveRight, Radiation, RefreshCcw, Rotate3D, Thermometer, ThermometerSun, TrendingUpDown, Waves, Wind, WindArrowDown } from "lucide-react"

const Tools = () => {
    const toolsData = [
        {
            key: "heat",
            label: "Heat",
            layout: "grid",
            items: [
                { icon: Thermometer, title: "Temperature"},
                { icon: Flame, title: "Heat Flux" },
                { icon: BrickWallFire, title: "Internal Heat" },
                { icon: AlarmSmoke, title: "Insulation" },
                { icon: RefreshCcw, title: "Convection" },
                { icon: Radiation, title: "Radiation" }
            ]
        },
        {
            key: "fluid-field",
            label: "Fluid Field",
            layout: "row",
            items: [
                { icon: Waves, title: "Water" },
                { icon: Wind, title: "Air" }
            ]
        },
        {
            key: "kinematics",
            label: "Kinematics",
            layout: "row",
            items: [
                { icon: Rotate3D, title: "Angular Velocity"},
                { icon: MoveRight, title: "Linear Velocity" },
                { icon: TrendingUpDown, title: "Force" }
            ]
        },
        {
            key: "visualization",
            label: "Visualization",
            layout: "col",
            items: [
                { icon: ThermometerSun, title: "Temp Field" },
                { icon: ChartNoAxesGantt, title: "Velocity Field" },
                { icon: WindArrowDown, title: "Pressure Field" }
            ]
        },
        {
            key: "data",
            label: "Data",
            layout: "row",
            items: [
                { icon: Database, title: "Import Data" },
                { icon: ChartLine, title: "Add Graph" },
                { icon: FileText, title: "Export Results" }
            ]
        }
    ]

    return (
        <div className="toolbar-container">
            {toolsData.map((section, index) => (
                <>
                <div className={`toolbar-section ${section.key}`} key={section.key}>

                    <ul className={`toolbar-icons ${section.layout}`}>
                        {section.items.map((tool, i) => (
                            <li className={`toolbar-item ${section.layout}`} key={i}>
                                <tool.icon className={`tool-icon ${section.layout}`}/>
                                <span className={`tool-title ${section.layout}`}>{tool.title}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="toolbar-label">{section.label}</div>

                </div>
                {index < toolsData.length - 1 &&
                    <div className="toolbar-divider"></div>
                }

                </>
            ))}
        </div>
    )
}

export default Tools