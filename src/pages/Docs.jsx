import { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowRight, ChevronRight } from "lucide-react";

import { docsPages } from "@/content/docs-content";
import { createPageUrl } from "@/utils";

const docsPaths = new Map(
  docsPages.map((page) => [
    `/${page.slug === "index" ? "" : page.slug}`,
    page.slug,
  ]),
);

const markdownComponents = (setActivePage) => ({
  h2: ({ children }) => (
    <h2 className="mt-8 text-lg font-semibold tracking-tight text-foreground first:mt-0">
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }) => {
    const normalizedHref = href?.replace(/\/$/, "") || "/";
    const docsSlug = docsPaths.get(
      normalizedHref === "" ? "/" : normalizedHref,
    );

    if (docsSlug) {
      return (
        <button
          type="button"
          onClick={() => setActivePage(docsSlug)}
          className="font-medium text-foreground underline underline-offset-4"
        >
          {children}
        </button>
      );
    }

    return (
      <a
        href={href}
        className="font-medium text-foreground underline underline-offset-4"
      >
        {children}
      </a>
    );
  },
});

export default function Docs() {
  const [activePageSlug, setActivePageSlug] = useState(docsPages[0].slug);
  const activePage =
    docsPages.find((page) => page.slug === activePageSlug) ?? docsPages[0];
  const currentIndex = docsPages.findIndex(
    (page) => page.slug === activePage.slug,
  );
  const previousPage = currentIndex > 0 ? docsPages[currentIndex - 1] : null;
  const nextPage =
    currentIndex < docsPages.length - 1 ? docsPages[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Documentation
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            AgentHub Docs
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            The website docs live here at{" "}
            <span className="font-medium text-foreground">/docs</span>. Mintlify
            stays in sync as a mirrored copy for the same customer content.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <nav className="space-y-1 rounded-2xl border border-border bg-muted/20 p-2">
              {docsPages.map((page) => (
                <button
                  key={page.slug}
                  type="button"
                  onClick={() => setActivePageSlug(page.slug)}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    page.slug === activePage.slug
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-background hover:text-foreground"
                  }`}
                >
                  {page.navTitle}
                </button>
              ))}
            </nav>
          </aside>

          <section className="min-w-0 rounded-3xl border border-border bg-background shadow-sm">
            <div className="border-b border-border px-6 py-5">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>docs</span>
                <ChevronRight className="h-3 w-3" />
                <span>{activePage.slug}</span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {activePage.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {activePage.description}
              </p>
            </div>

            <div className="px-6 py-6">
              <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
                <ReactMarkdown
                  components={markdownComponents(setActivePageSlug)}
                >
                  {activePage.body}
                </ReactMarkdown>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border px-6 py-4 text-sm">
              <div>
                {previousPage ? (
                  <button
                    type="button"
                    onClick={() => setActivePageSlug(previousPage.slug)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    ← {previousPage.navTitle}
                  </button>
                ) : null}
              </div>
              <div>
                {nextPage ? (
                  <button
                    type="button"
                    onClick={() => setActivePageSlug(nextPage.slug)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {nextPage.navTitle} →
                  </button>
                ) : null}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-border bg-muted/20 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Ready to start?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a free hub and put your first agent to work.
            </p>
          </div>
          <Link
            to={createPageUrl("Start")}
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Start free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
