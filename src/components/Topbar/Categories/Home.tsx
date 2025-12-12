import { Box, Camera, Clipboard, Copy, Eye, FileDown, FileUp, FolderOpen, FolderPlus, Globe, Group, Image, LayoutGrid, Move3D, Ruler, Save, Scissors, Trash, Ungroup, View } from "lucide-react"

const Home = () => {
    const homeToolsData = {
        quickAccess: {
            category: "Quick Access",
            data: [
                {
                    icon: FolderPlus,
                    title: "New"
                },
                {
                    icon: FolderOpen,
                    title: "Open"
                },
                {
                    icon: Save,
                    title: "Save"
                },
                {
                    icon: FileUp,
                    title: "Import"
                },
                {
                    icon: FileDown,
                    title: "Export"
                }
            ]
        },
        objectManagement: {
            category: "Object Management",
            data: [
                {
                    icon: Box,
                    title: "Geometry"
                },
                {
                    icon: Copy,
                    title: "Copy"
                },
                {
                    icon: Scissors,
                    title: "Cut"
                },
                {
                    icon: Clipboard,
                    title: "Paste"
                },
                {
                    icon: Trash,
                    title: "Delete"
                },
                {
                    icon: Group,
                    title: "Group"
                }, 
                {
                    icon: Ungroup,
                    title: "Ungroup"
                }
            ]
        },
        viewManagement: {
            category: "View Management",
            data: [
                {
                    icon: Eye,
                    title: "Single View"
                },
                {
                    icon: View,
                    title: "2D/3D View"
                },
                {
                    icon: Move3D,
                    title: "Axis View"
                },
                {
                    icon: Camera,
                    title: "Perspective"
                },
                {
                    icon: Box,
                    title: "Orthographic"
                },
                {
                    icon: LayoutGrid,
                    title: "Toggle Grid"
                }
            ]
        },
        sceneManagement: {
            category: "Scene Management",
            data: [
                {
                    icon: Ruler,
                    title: "Unit System"
                },
                {
                    icon: Globe,
                    title: "Scene Settings"
                },
                {
                    icon: Image,
                    title: "Environment Appearance"
                }
            ]
        }
    }

    return (
        <div className="home-tools tools">
            {Object.values(homeToolsData).map((section, idx) => (
                <>
                <div className="section" key={idx}>
                    <ul className="tool-set">
                        {section.data.map((tool, i) => (
                            <li className="tool" key={i}>
                                <tool.icon/>
                                {tool.title}
                            </li>
                        ))}
                    </ul>
                </div>
                </>
            ))}
        </div>
    )
}

export default Home