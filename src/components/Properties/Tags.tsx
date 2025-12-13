import { ChevronRight, X } from "lucide-react"

const Tags = () => {
    const tagsData = [
        {
            id: "fixed-temperature",
            name: "Fixed Temperature"
        },
        {
            id: "heat-flux",
            name: "Heat Flux"
        },
        {
            id: "insulation",
            name: "Insulation"
        },
        {
            id: "angular-velocity",
            name: "Fixed Temperature"
        },
        {
            id: "linear-velocity",
            name: "Linear Velocity"
        },
    ]

  return (
    <div className="subpanel">
        <span className="subpanel-title">Tags</span>

        <div className="subpanel-container material">
            {tagsData.map((tag, idx) => (
                <div className="tag" key={idx}>
                    <div className="tag-wrapper">
                        <ChevronRight className="tag-icon"/>
                        <span className="tag-name">
                            {tag.name}
                        </span>
                    </div>
                    <X className="tag-icon"/>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Tags