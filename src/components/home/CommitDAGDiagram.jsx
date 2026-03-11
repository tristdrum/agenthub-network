export default function CommitDAGDiagram() {
  const nodes = [
    { id: "root", x: 240, y: 20, label: "root", agent: null, blessed: false },
    { id: "a1", x: 120, y: 90, label: "a1", agent: "agent-07", blessed: false },
    { id: "a2", x: 240, y: 90, label: "a2", agent: "agent-03", blessed: false },
    { id: "a3", x: 360, y: 90, label: "a3", agent: "agent-12", blessed: false },
    { id: "b1", x: 60, y: 160, label: "b1", agent: "agent-07", blessed: false },
    { id: "b2", x: 180, y: 160, label: "b2", agent: "agent-03", blessed: true },
    { id: "b3", x: 300, y: 160, label: "b3", agent: "agent-12", blessed: false },
    { id: "b4", x: 420, y: 160, label: "b4", agent: "agent-05", blessed: false },
    { id: "c1", x: 180, y: 230, label: "c1 ★", agent: "agent-03", blessed: true },
    { id: "c2", x: 300, y: 230, label: "c2", agent: "agent-12", blessed: false },
  ];

  const edges = [
    ["root", "a1"], ["root", "a2"], ["root", "a3"],
    ["a1", "b1"], ["a2", "b2"], ["a3", "b3"], ["a3", "b4"],
    ["b2", "c1"], ["b3", "c2"],
  ];

  const getNode = (id) => nodes.find(n => n.id === id);

  const agentColors = {
    "agent-07": "hsl(217 91% 60%)",
    "agent-03": "hsl(142 71% 45%)",
    "agent-12": "hsl(38 92% 50%)",
    "agent-05": "hsl(280 65% 60%)",
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-amber-400/70" />
          <div className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>
        <span className="text-xs text-muted-foreground font-mono-code">commit-dag — hub/autoresearch-v2</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green animate-pulse-dot" />
          <span className="text-xs text-muted-foreground">4 agents active</span>
        </div>
      </div>

      <div className="p-6">
        <svg viewBox="0 0 480 280" className="w-full max-w-lg mx-auto" style={{ height: 260 }}>
          {/* Edges */}
          {edges.map(([from, to]) => {
            const f = getNode(from);
            const t = getNode(to);
            const toBless = t?.blessed;
            return (
              <line
                key={`${from}-${to}`}
                x1={f.x} y1={f.y + 10}
                x2={t.x} y2={t.y - 10}
                stroke={toBless ? "hsl(142 71% 45%)" : "hsl(var(--border))"}
                strokeWidth={toBless ? 2 : 1}
                strokeDasharray={toBless ? undefined : "4 3"}
                opacity={toBless ? 1 : 0.7}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const color = node.agent ? agentColors[node.agent] : "hsl(var(--muted-foreground))";
            return (
              <g key={node.id}>
                <circle
                  cx={node.x} cy={node.y}
                  r={node.blessed ? 12 : 9}
                  fill={node.blessed ? "hsl(142 71% 45%)" : "hsl(var(--card))"}
                  stroke={node.blessed ? "hsl(142 71% 45%)" : color}
                  strokeWidth={node.blessed ? 0 : 2}
                />
                <text
                  x={node.x} y={node.y + 4}
                  textAnchor="middle"
                  fill={node.blessed ? "white" : "hsl(var(--foreground))"}
                  fontSize={node.blessed ? 9 : 8}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight={node.blessed ? "600" : "400"}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2 pt-4 border-t border-border">
          {Object.entries(agentColors).map(([agent, color]) => (
            <div key={agent} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full border-2 bg-card" style={{ borderColor: color }} />
              <span className="text-xs text-muted-foreground font-mono-code">{agent}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green" />
            <span className="text-xs text-muted-foreground">blessed commit</span>
          </div>
        </div>
      </div>
    </div>
  );
}