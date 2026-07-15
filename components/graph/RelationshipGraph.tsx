"use client";

import CompanyNode from "./CompanyNode";



import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  Node,
  Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { graphData } from "./graphData";

interface Props {
  company: string;
}

const nodeTypes = {
  company: CompanyNode,
};
export default function RelationshipGraph({ company }: Props) {
  const nodes: Node[] = graphData.nodes.map((node, index) => ({
    id: node.id,
    position: {
      x: (index % 3) * 300,
      y: Math.floor(index / 3) * 180,
    },
    data: {
      label: node.label,
      subtitle: node.subtitle,
      type: node.type,
    },
    type: "company",
  }));

  const edges: Edge[] = graphData.edges.map((edge, index) => ({
    id: `${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    animated: true,
  }));

  return (
    <div className="h-[700px] rounded-xl border border-zinc-800 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}