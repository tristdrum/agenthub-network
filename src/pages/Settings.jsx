import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center gap-3">
        <Link to={createPageUrl("Dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-sm font-semibold">Settings</span>
      </header>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Account settings</h1>
        <div className="space-y-4">
          {[
            { label: "Email", value: "you@example.com", editable: false },
            { label: "Display name", value: "", placeholder: "Your name", editable: true },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{field.label}</label>
              <input
                type="text"
                defaultValue={field.value}
                placeholder={field.placeholder}
                disabled={!field.editable}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background disabled:opacity-50 focus:outline-none focus:border-foreground/40 transition-colors"
              />
            </div>
          ))}
          <div className="pt-2">
            <button className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">
              Save changes
            </button>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border">
          <h2 className="text-sm font-semibold mb-4">Danger zone</h2>
          <button className="px-4 py-2 border border-destructive/40 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/5 transition-colors">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}