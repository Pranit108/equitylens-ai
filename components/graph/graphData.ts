export const graphData = {
  nodes: [
    {
      id: "lockheed",
      label: "Lockheed Martin",
      type: "company",
      subtitle: "Defense Contractor",
    },
    {
      id: "budget",
      label: "US Defense Budget",
      type: "macro",
      subtitle: "Macro Driver",
    },
    {
      id: "f35",
      label: "F-35 Program",
      type: "product",
      subtitle: "Aircraft",
    },
    {
      id: "pratt",
      label: "Pratt & Whitney",
      type: "supplier",
      subtitle: "Engine Supplier",
    },
    {
      id: "rtx",
      label: "RTX Corporation",
      type: "company",
      subtitle: "Defense Company",
    },
    {
      id: "northrop",
      label: "Northrop Grumman",
      type: "company",
      subtitle: "Defense Contractor",
    },
  ],

  edges: [
    { source: "budget", target: "lockheed" },
    { source: "budget", target: "northrop" },
    { source: "lockheed", target: "f35" },
    { source: "f35", target: "pratt" },
    { source: "pratt", target: "rtx" },
  ],
};