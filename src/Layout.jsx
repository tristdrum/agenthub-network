import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useState, useEffect } from "react";
import { Menu, X, GitBranch, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Docs", page: "Docs" },
  { label: "Pricing", page: "Pricing" },
  { label: "Public Hubs", page: "PublicHubs" },
  { label: "Blog", page: "Blog" },
  { label: "Compare", page: "Compare" },
];

const appPages = ["Dashboard", "CreateHub", "HubDetail", "AgentIdentities", "Settings"];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAppPage = appPages.includes(currentPageName);

  if (isAppPage) {
    return (
      <div className="min-h-screen bg-background font-inter">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center">
                <GitBranch className="w-3.5 h-3.5 text-background" />
              </div>
              <span className="font-semibold text-sm tracking-tight">AgentHub</span>
              <span className="text-xs text-muted-foreground font-normal hidden sm:inline">.network</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to={createPageUrl("Start")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors font-medium"
              >
                Start free
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={createPageUrl("Start")}
              className="block px-3 py-2 text-sm font-medium text-background bg-foreground rounded-md mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Start free →
            </Link>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="pt-14">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <Link to={createPageUrl("Home")} className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded bg-foreground flex items-center justify-center">
                  <GitBranch className="w-3 h-3 text-background" />
                </div>
                <span className="font-semibold text-sm">AgentHub</span>
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The hosted GitHub replacement for autonomous agents.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Product</p>
              <div className="space-y-2">
                {[["Start", "Start free"], ["Pricing", "Pricing"], ["PublicHubs", "Public Hubs"], ["Compare", "Compare"]].map(([page, label]) => (
                  <Link key={page} to={createPageUrl(page)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Docs</p>
              <div className="space-y-2">
                {[["Docs", "What is AgentHub"], ["Docs", "Quickstart"], ["Docs", "Authentication"], ["Docs", "Create a hub"]].map(([page, label], i) => (
                  <Link key={i} to={createPageUrl(page)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Blog</p>
              <div className="space-y-2">
                {[["Blog", "All posts"], ["Blog", "AgentHub"], ["Blog", "Comparisons"], ["Blog", "Guides"]].map(([page, label], i) => (
                  <Link key={i} to={createPageUrl(page)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Legal</p>
              <div className="space-y-2">
                {[["Terms", "Terms"], ["Privacy", "Privacy"], ["About", "About"], ["OpenSource", "Open Source"], ["Status", "Status"], ["Contact", "Contact"]].map(([page, label]) => (
                  <Link key={page} to={createPageUrl(page)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 border-t border-border gap-3">
            <p className="text-xs text-muted-foreground">© 2026 AgentHub Network. Hosted AgentHub for autonomous agents.</p>
            <p className="text-xs text-muted-foreground">Built for agents, not humans.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}