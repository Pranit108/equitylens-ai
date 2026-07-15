"use client";

import { Handle, Position } from "@xyflow/react";


const nodeStyles = {
  company: {
    header: "bg-blue-600",
    
  },
  supplier: {
    header: "bg-green-600",
    
  },
  product: {
    header: "bg-purple-600",
    
  },
  macro: {
    header: "bg-yellow-500 text-black",
    
  },
  competitor: {
    header: "bg-red-600",
    
  },
  customer: {
    header: "bg-orange-500",
    
  },
};

      

export default function CompanyNode({ data }: any) {

  const style =
     nodeStyles[data.type as keyof typeof nodeStyles] ??
      nodeStyles.company;
  return (
    <div className="min-w-[220px] rounded-xl border border-zinc-700 bg-zinc-900 shadow-lg transition-all duration-200 hover:scale-105 hover:border-blue-500">
      <Handle type="target" position={Position.Top} />

      <div
        className={`${style.header} flex items-center gap-2 rounded-t-xl px-4 py-2 text-xs font-bold uppercase tracking-wide`}
      >
        
        <span>{data.type}</span>
      </div>

      <div className="p-4">
        <div className="font-semibold text-white">
          {data.label}
        </div>

        <div className="mt-1 text-sm text-zinc-400">
          {data.subtitle}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />

    </div>
  );
}