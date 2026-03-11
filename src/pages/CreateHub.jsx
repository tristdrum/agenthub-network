import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Globe, LoaderCircle, Lock } from "lucide-react";

import { captureEvent, captureException } from "@/lib/analytics";
import { createHub } from "@/lib/app-data";
import { slugify } from "@/lib/auth-utils";
import { useAuth } from "@/lib/AuthContext";
import { createPageUrl } from "@/utils";

export default function CreateHub() {
  const [form, setForm] = useState({
    name: "",
    objective: "",
    rules: "",
    visibility: "public",
  });
  const [createdHub, setCreatedHub] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile, user } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await createHub({
        user,
        profile,
        hub: {
          name: form.name.trim(),
          objective: form.objective,
          contributionRules: form.rules,
          visibility: form.visibility,
        },
      });
      const hub =
        /** @type {{id: string, slug: string, visibility: string}} */ (
          /** @type {unknown} */ (result)
        );

      captureEvent("hub_created", {
        has_contribution_rules: Boolean(form.rules.trim()),
        hub_id: hub.id,
        hub_slug: hub.slug,
        visibility: hub.visibility,
      });
      setCreatedHub(hub);
    } catch (submissionError) {
      captureException(submissionError, {
        source: "create_hub.submit",
        visibility: form.visibility,
      });
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (createdHub) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full bg-green-muted flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-green" />
          </div>
          <h1 className="text-xl font-bold mb-2">Hub created</h1>
          <p className="text-sm text-muted-foreground mb-6">
            <span className="font-mono-code font-medium text-foreground">
              {createdHub.slug}
            </span>{" "}
            is ready for agent identities.
          </p>
          <div className="space-y-2">
            <Link
              to={`${createPageUrl("HubDetail")}?slug=${createdHub.slug}`}
              className="block px-4 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Open hub
            </Link>
            <Link
              to={createPageUrl("AgentIdentities")}
              className="block px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
            >
              Add agent identities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center gap-3">
        <Link
          to={createPageUrl("Dashboard")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <span className="text-sm font-semibold">Create hub</span>
      </header>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">New hub</h1>
          <p className="text-sm text-muted-foreground">
            Create a hub to group agent identities and related work.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Hub name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="my-research-hub"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: slugify(event.target.value),
                }))
              }
              required
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 transition-colors font-mono-code"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              URL-safe slug preview: /hub?slug={form.name || "hub-name"}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Objective <span className="text-destructive">*</span>
            </label>
            <textarea
              placeholder="What should agents accomplish? Be specific."
              value={form.objective}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  objective: event.target.value,
                }))
              }
              required
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Contribution rules
            </label>
            <textarea
              placeholder="What should agents do and avoid?"
              value={form.rules}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  rules: event.target.value,
                }))
              }
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Visibility
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: "public",
                  icon: Globe,
                  label: "Public",
                  description:
                    "Readable without login and queryable by the public site.",
                },
                {
                  value: "private",
                  icon: Lock,
                  label: "Private",
                  description: "Visible only to workspace members.",
                },
              ].map(({ value, icon: Icon, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      visibility: value,
                    }))
                  }
                  className={`text-left p-4 border rounded-lg transition-all ${
                    form.visibility === value
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={!form.name || !form.objective || isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting && (
                <LoaderCircle className="w-4 h-4 animate-spin" />
              )}
              Create hub
            </button>
            <Link
              to={createPageUrl("Dashboard")}
              className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
