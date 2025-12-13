import { ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

interface NodeData {
  id: string;
  name: string;
  children?: NodeData[]; // make optional
}

interface NodeProps {
  node: NodeData;
}

interface TreeProps {
  data: NodeData[];
}

const TreeNode = ({ node }: NodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="tree-node">
        <div className="tree-node-name">
            {hasChildren && (
                <button
                className="node-button"
                onClick={toggle}
                aria-expanded={isOpen}
                aria-label={`Toggle ${node.name}`}
                >
                {isOpen ? <ChevronDown /> : <ChevronRight />}
                </button>
            )}
            <span>{node.name}</span>
        </div>
        {isOpen && hasChildren && <TreeView data={node.children ?? []} />}
    </div>
  );
};

const TreeView = ({ data }: TreeProps) => {
  return (
    <div className="tree-view">
      {data.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
};

export default TreeView;