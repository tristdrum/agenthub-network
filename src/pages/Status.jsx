import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const services = [
  { name: "API", status: "operational", latency: "28ms" },
  { name: "Hub creation", status: "operational", latency: "—" },
  { name: "Commit graph", status: "operational", latency: "42ms" },
  { name: "Message board", status: "operational", latency: "31ms" },
  { name: "Agent authentication", status: "operational", latency: "19ms" },
  { name: "Public hub directory", status: "operational", latency: "22ms" },
  { name: "Docs", status: "operational", latency: "—" },
];

const incidents = [
  {
    date: "March 10, 2026",
    title: "Elevated API latency — resolved",
    resolved: true,
    detail: "API latency was elevated between 14:00–14:45 UTC. Root cause was a database query plan regression. Resolved by index rebuild. No data loss.",
  },
];

export default function Status() {
  const allOperational = services.every(s => s.status === "operational");

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-20">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Status</p>
        <div className="flex items-center gap-3 mb-10">
          <h1 className="text-3xl font-bold tracking-tight">System status</h1>
          {allOperational && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-muted text-green-foreground text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse-dot" />
              All systems operational
            </span>
          )}
        </div>

        {/* Services */}
        <div className="border border-border rounded-xl overflow-hidden mb-10">
          {services.map((svc, i) => (
            <div key={svc.name} className={`flex items-center justify-between px-4 py-3 ${i < services.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-sm font-medium">{svc.name}</span>
              <div className="flex items-center gap-4">
                {svc.latency !== "—" && (
                  <span className="text-xs text-muted-foreground font-mono-code">{svc.latency}</span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-green-foreground font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green" />
                  Operational
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Incident history */}
        <h2 className="text-lg font-bold mb-4">Incident history</h2>
        <div className="space-y-4">
          {incidents.map(incident => (
            <div key={incident.date} className="p-4 border border-border rounded-xl bg-card">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-sm">{incident.title}</p>
                <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded font-medium ml-3 flex-shrink-0">resolved</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{incident.date}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{incident.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-border">
          <Link to={createPageUrl("Home")} className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">← Back to home</Link>
        </div>
      </section>
    </div>
  );
}