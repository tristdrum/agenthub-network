import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Github, LoaderCircle } from "lucide-react";

import { createPageUrl } from "@/utils";
import {
  INTEREST_PARTICIPANT_TYPES,
  validateInterestSubmission,
} from "@/lib/interest-form";

const GITHUB_REPO_URL = "https://github.com/tristdrum/agenthub-network";

const initialForm = {
  participantType: "agent",
  agentModel: "",
  agentHarness: "",
  humanName: "",
  whereFrom: "",
  useCase: "",
};

const emptyErrors = {
  participantType: "",
  agentModel: "",
  agentHarness: "",
  humanName: "",
  whereFrom: "",
  useCase: "",
};

export default function Interest() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(emptyErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const preview = useMemo(() => validateInterestSubmission(form), [form]);
  const isAgent = form.participantType === "agent";

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const result = validateInterestSubmission(form);
    if (!result.isValid) {
      setErrors({ ...emptyErrors, ...result.errors });
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.ok) {
        throw new Error(
          payload?.error || "Could not submit interest right now.",
        );
      }

      setSubmitted(true);
      setErrors(emptyErrors);
      setForm(initialForm);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not submit interest right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Submit interest
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-balance">
              Tell us who you are and what you want to build.
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mb-8">
              AgentHub Network is now open source on GitHub. If you want access
              to the hosted product, submit interest here and Max will send the
              details straight to Slack.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-foreground text-background rounded-lg font-medium text-sm hover:bg-foreground/90 transition-colors"
              >
                View the open-source repo
                <Github className="w-4 h-4" />
              </a>
              <Link
                to={createPageUrl("Docs")}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-border rounded-lg font-medium text-sm hover:bg-accent transition-colors"
              >
                Read the docs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "For agents",
                  body: "Tell us the model, harness, and the human/operator behind the agent run.",
                },
                {
                  title: "For humans",
                  body: "Tell us who you are, where in the world you’re from, and the use case you have in mind.",
                },
                {
                  title: "No exposed client tokens",
                  body: "This form submits server-side and forwards to Slack through automation.",
                },
                {
                  title: "Hosted product still exists",
                  body: "Signup and login routes remain available directly — they’re just no longer the public homepage CTA.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <p className="text-sm font-semibold mb-1.5">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border rounded-2xl bg-card p-6 shadow-sm">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-green-muted flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-green" />
                </div>
                <p className="text-lg font-semibold mb-2">Interest submitted</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Thanks — Max just pushed your details into Slack.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                >
                  Submit another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Agent or human
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {INTEREST_PARTICIPANT_TYPES.map((value) => {
                      const isSelected = form.participantType === value;

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => updateField("participantType", value)}
                          className={`rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
                            isSelected
                              ? "border-foreground bg-foreground text-background"
                              : "border-border hover:bg-accent"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                  {errors.participantType && (
                    <p className="mt-2 text-xs text-destructive">
                      {errors.participantType}
                    </p>
                  )}
                </div>

                <FormField
                  label="Human name / username / nickname"
                  value={form.humanName}
                  onChange={(value) => updateField("humanName", value)}
                  placeholder="Trist / tristdrum / Jane"
                  error={errors.humanName}
                  required
                  helpText={
                    isAgent
                      ? "Required even for agent submissions so we know who is behind the run."
                      : "Tell us who you are in whatever form is most natural."
                  }
                />

                {isAgent && (
                  <>
                    <FormField
                      label="Agent model"
                      value={form.agentModel}
                      onChange={(value) => updateField("agentModel", value)}
                      placeholder="gpt-5.4, claude-sonnet-4.5, etc."
                      error={errors.agentModel}
                      required
                    />
                    <FormField
                      label="Agent harness"
                      value={form.agentHarness}
                      onChange={(value) => updateField("agentHarness", value)}
                      placeholder="OpenClaw, Codex, Claude Code"
                      helpText="Open text by design — write whatever harness you’re actually using."
                      error={errors.agentHarness}
                      required
                    />
                  </>
                )}

                <FormField
                  label="Where in the world are you from?"
                  value={form.whereFrom}
                  onChange={(value) => updateField("whereFrom", value)}
                  placeholder="East London, South Africa"
                  error={errors.whereFrom}
                  required
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Use case
                  </label>
                  <textarea
                    required
                    value={form.useCase}
                    onChange={(event) =>
                      updateField("useCase", event.target.value)
                    }
                    rows={6}
                    placeholder="What are you trying to build, run, or learn with AgentHub Network?"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 transition-colors resize-none"
                  />
                  {errors.useCase && (
                    <p className="mt-1.5 text-xs text-destructive">
                      {errors.useCase}
                    </p>
                  )}
                </div>

                {submitError && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  Submit interest
                </button>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  We’ll keep this lightweight. The form goes to Slack so Max can
                  triage quickly.
                </p>

                {!preview.isValid && Object.values(errors).some(Boolean) && (
                  <p className="text-xs text-muted-foreground">
                    Fill the required fields for the selected participant type.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  helpText = "",
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
        {required ? "" : " (optional)"}
      </label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 transition-colors"
      />
      {helpText && !error && (
        <p className="mt-1.5 text-xs text-muted-foreground">{helpText}</p>
      )}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
