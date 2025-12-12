import { Box, Camera, Clipboard, Copy, Eye, FileDown, FileUp, FolderOpen, FolderPlus, Globe, Group, Image, LayoutGrid, Move3D, Ruler, Save, Scissors, Trash, Ungroup, View } from "lucide-react"

const Home = () => {
    const homeToolsData = [
        {
            key: "quick-access",
            label: "Quick Access",
            layout: "row",
            items: [
                { icon: FolderPlus, title: "New"},
                { icon: FolderOpen, title: "Open"},
                { icon: Save, title: "Save"},
                { icon: FileUp, title: "Import"},
                { icon: FileDown, title: "Export"}
            ]
        },
        {
            key: "geometry",
            label: "Geometry",
            layout: "row",
            items: [
                { icon: Box, title: "Add"}
            ]
        },
        {
            key: "object-management",
            label: "Object Management",
            layout: "grid",
            items: [
                { icon: Copy, title: "Copy"},
                { icon: Scissors, title: "Cut"},
                { icon: Clipboard, title: "Paste"},
                { icon: Group, title: "Group"},
                { icon: Ungroup, title: "Ungroup"},
                { icon: Trash, title: "Delete" }
            ]
        },
        {
            key: "view-management",
            label: "View Management",
            layout: "grid",
            items: [
                { icon: Eye, title: "Single View"},
                { icon: View, title: "2D/3D View"},
                { icon: Move3D, title: "Axis View"},
                { icon: Camera, title: "Perspective"},
                { icon: Box, title: "Orthographic"},
                { icon: LayoutGrid, title: "Toggle Grid"}
            ]
        },
        {
            key: "scene-management",
            label: "Scene Management",
            layout: "col",
            items: [
                { icon: Ruler, title: "Units System"},
                { icon: Globe, title: "Scene Settings"},
                { icon: Image, title: "Environment"}
            ]
        }
    ]

    return (
        <div className="toolbar-container">
            {homeToolsData.map((section, index) => (
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
                {index < homeToolsData.length - 1 &&
                    <div className="toolbar-divider"></div>
                }
                </>
            ))}

        </div>
    )
}

export default Home