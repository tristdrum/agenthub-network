import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { GitBranch, ArrowLeft } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-5">
          <GitBranch className="w-6 h-6 text-muted-foreground" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-3">404</h1>
        <p className="text-muted-foreground mb-6">This page doesn't exist. The commit you're looking for isn't in the graph.</p>
        <Link
          to={createPageUrl("Home")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}