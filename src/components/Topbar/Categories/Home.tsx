import { Box, Camera, Clipboard, Copy, Eye, FileDown, 
    FileUp, FolderOpen, FolderPlus, Globe, Group, Image, 
    LayoutGrid, Move3D, Ruler, Save, Scissors, Trash, Ungroup, View } from "lucide-react"
import { useRef } from "react"
import { executeEditorAction } from "../../../editor/editor";

const Home = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleToolClick = (action: string) => {
        if (action === "IMPORT_OBJECT")
            fileInputRef.current?.click();
        else
            executeEditorAction(action as any);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            executeEditorAction("IMPORT_OBJECT", file);
        } 
    }

    const homeToolsData = [
        {
            key: "quick-access",
            label: "Quick Access",
            layout: "row",
            items: [
                { icon: FolderPlus, title: "New", action: "PROJECT_NEW"},
                { icon: FolderOpen, title: "Open", action: "PROJECT_OPEN"},
                { icon: Save, title: "Save", action: "PROJECT_SAVE"},
                { icon: FileUp, title: "Import", action: "IMPORT_OBJECT"},
                { icon: FileDown, title: "Export", action: "EXPORT"}
            ]
        },
        {
            key: "geometry",
            label: "Geometry",
            layout: "row",
            items: [
                { icon: Box, title: "Add", action: "OPEN_GEOMETRY"}
            ]
        },
        {
            key: "object-management",
            label: "Object Management",
            layout: "grid",
            items: [
                { icon: Copy, title: "Copy", action: "COPY"},
                { icon: Scissors, title: "Cut", action: "CUT"},
                { icon: Clipboard, title: "Paste", action: "PASTE"},
                { icon: Group, title: "Group", action: "GROUP"},
                { icon: Ungroup, title: "Ungroup", action: "UNGROUP"},
                { icon: Trash, title: "Delete", action: "DELETE"}
            ]
        },
        {
            key: "view-management",
            label: "View Management",
            layout: "grid",
            items: [
                { icon: Eye, title: "Single View", action: "VIEW_SINGLE"},
                { icon: View, title: "2D/3D View", action: "VIEW_SPLIT"},
                { icon: Move3D, title: "Axis View", action: "VIEW_AXIS"},
                { icon: Camera, title: "Perspective", action: "VIEW_PERSPECTIVE"},
                { icon: Box, title: "Orthographic", action: "VIEW_ORTHOGRAPHIC"},
                { icon: LayoutGrid, title: "Toggle Grid", action: "TOGGLE_GRID"}
            ]
        },
        {
            key: "scene-management",
            label: "Scene Management",
            layout: "col",
            items: [
                { icon: Ruler, title: "Units System", action: "UNITS_SYSTEM"},
                { icon: Globe, title: "Scene Settings", action: "SCENE_SETTINGS"},
                { icon: Image, title: "Environment", action: "ENVIRONMENT"}
            ]
        }
    ]

    return (
        <div className="toolbar-container">
            <input
                type="file"
                accept=".obj"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            {homeToolsData.map((section, index) => (
                <>
                <div className={`toolbar-section ${section.key}`} key={section.key}>

                    <ul className={`toolbar-icons ${section.layout}`}>
                        {section.items.map((tool, i) => (
                            <li className={`toolbar-item ${section.layout}`} 
                                key={i}
                                onClick={() => handleToolClick(tool.action)}
                            >
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