import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Copy,
  Key,
  LoaderCircle,
  Plus,
  Trash2,
} from "lucide-react";

import { captureEvent, captureException } from "@/lib/analytics";
import {
  createAgentIdentity,
  loadAgentIdentityPageData,
  revokeAgentIdentity,
} from "@/lib/app-data";
import { useAuth } from "@/lib/AuthContext";
import { createPageUrl } from "@/utils";

export default function AgentIdentities() {
  const [pageState, setPageState] = useState({
    hubs: [],
    identities: [],
    isLoading: true,
    error: "",
  });
  const [showCreate, setShowCreate] = useState(false);
  const [newAgent, setNewAgent] = useState({ label: "", hubId: "" });
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRevoking, setIsRevoking] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    let isActive = true;

    async function load() {
      try {
        const data = await loadAgentIdentityPageData();
        if (isActive) {
          setPageState({
            ...data,
            isLoading: false,
            error: "",
          });
          setNewAgent((current) => ({
            ...current,
            hubId: current.hubId || data.hubs[0]?.id || "",
          }));
        }
      } catch (error) {
        if (isActive) {
          setPageState({
            hubs: [],
            identities: [],
            isLoading: false,
            error: error.message,
          });
        }

        captureException(error, {
          source: "agent_identities.load",
        });
      }
    }

    void load();

    return () => {
      isActive = false;
    };
  }, []);

  const hubById = useMemo(
    () => new Map(pageState.hubs.map((hub) => [hub.id, hub])),
    [pageState.hubs],
  );

  async function handleCreate(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setCreated(null);

    try {
      const result = await createAgentIdentity({
        hubId: newAgent.hubId,
        label: newAgent.label,
        userId: user.id,
      });

      captureEvent("agent_identity_created", {
        agent_identity_id: result.identity.id,
        core_agent_id: result.identity.core_agent_id,
        hub_id: result.identity.hub_id,
      });
      setCreated(result);
      setPageState((current) => ({
        ...current,
        identities: [result.identity, ...current.identities],
        error: "",
      }));
      setNewAgent({ label: "", hubId: newAgent.hubId });
    } catch (error) {
      captureException(error, {
        hub_id: newAgent.hubId,
        source: "agent_identities.create",
      });
      setPageState((current) => ({
        ...current,
        error: error.message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRevoke(identityId) {
    setIsRevoking(identityId);

    try {
      const revoked = await revokeAgentIdentity(identityId);
      captureEvent("agent_identity_revoked", {
        agent_identity_id: identityId,
      });
      setPageState((current) => ({
        ...current,
        identities: current.identities.map((identity) =>
          identity.id === identityId
            ? { ...identity, revoked_at: revoked.revoked_at }
            : identity,
        ),
      }));
    } catch (error) {
      captureException(error, {
        agent_identity_id: identityId,
        source: "agent_identities.revoke",
      });
      setPageState((current) => ({
        ...current,
        error: error.message,
      }));
    } finally {
      setIsRevoking("");
    }
  }

  function copy(text, key) {
    navigator.clipboard.writeText(text);
    captureEvent("agent_identity_secret_copied", {
      field: key,
    });
    setCopied(key);
    window.setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={createPageUrl("Dashboard")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-sm font-semibold">Agent identities</span>
        </div>
        <button
          onClick={() => {
            setShowCreate(true);
            setCreated(null);
          }}
          disabled={!pageState.hubs.length}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background rounded-lg text-xs font-medium hover:bg-foreground/90 transition-colors disabled:opacity-40"
        >
          <Plus className="w-3.5 h-3.5" />
          New identity
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Agent identity secrets are only shown once when you create them.
            Store them somewhere secure before you leave this page.
          </p>
        </div>

        {pageState.error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {pageState.error}
          </div>
        )}

        {showCreate && (
          <div className="mb-6 p-5 border-2 border-foreground rounded-xl bg-card">
            {!created ? (
              <>
                <h2 className="font-semibold mb-4">New agent identity</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                        Agent label
                      </label>
                      <input
                        type="text"
                        placeholder="agent-07"
                        value={newAgent.label}
                        onChange={(event) =>
                          setNewAgent((current) => ({
                            ...current,
                            label: event.target.value,
                          }))
                        }
                        required
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40 font-mono-code"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                        Assign to hub
                      </label>
                      <select
                        value={newAgent.hubId}
                        onChange={(event) =>
                          setNewAgent((current) => ({
                            ...current,
                            hubId: event.target.value,
                          }))
                        }
                        required
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-foreground/40"
                      >
                        {pageState.hubs.map((hub) => (
                          <option key={hub.id} value={hub.id}>
                            {hub.slug}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting && (
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                      )}
                      Generate credentials
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreate(false)}
                      className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-green" />
                  <h2 className="font-semibold">Identity created</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Copy these credentials now. Only the hash is stored after this
                  step.
                </p>
                <div className="space-y-3">
                  {[
                    {
                      label: "Agent ID",
                      value: created.identity.core_agent_id,
                    },
                    { label: "API Key", value: created.token },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-muted-foreground mb-1">
                        {label}
                      </p>
                      <div className="flex items-center gap-2 px-3 py-2 bg-foreground rounded-lg">
                        <span className="flex-1 font-mono-code text-xs text-background/80 truncate">
                          {value}
                        </span>
                        <button
                          onClick={() => copy(value, label)}
                          className="flex-shrink-0"
                        >
                          {copied === label ? (
                            <Check className="w-3.5 h-3.5 text-green" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-background/60 hover:text-background" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowCreate(false)}
                  className="mt-4 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}

        {pageState.isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <LoaderCircle className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !pageState.hubs.length ? (
          <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
            <Key className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold">Create a hub first</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Agent identities belong to a hub, so there is nothing to issue
              yet.
            </p>
            <Link
              to={createPageUrl("CreateHub")}
              className="inline-flex mt-4 items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Create a hub
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {pageState.identities.map((identity) => {
              const hub = hubById.get(identity.hub_id);
              const revoked = Boolean(identity.revoked_at);

              return (
                <div
                  key={identity.id}
                  className={`flex items-center justify-between p-4 border rounded-xl ${revoked ? "opacity-50 bg-muted/20" : "bg-card"} border-border`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Key className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-code text-sm font-semibold">
                          {identity.label}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            revoked
                              ? "bg-muted text-muted-foreground"
                              : "bg-green-muted text-green-foreground"
                          }`}
                        >
                          {revoked ? "revoked" : "active"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {hub?.slug || "Unknown hub"} · {identity.core_agent_id}{" "}
                        · fingerprint {identity.api_key_fingerprint}
                      </p>
                    </div>
                  </div>
                  {!revoked && (
                    <button
                      type="button"
                      onClick={() => void handleRevoke(identity.id)}
                      disabled={isRevoking === identity.id}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10 disabled:opacity-50"
                    >
                      {isRevoking === identity.id ? (
                        <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 p-4 border border-border rounded-xl bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Sign in to manage identities in the web app. Agents use their
            generated credentials to connect to the API.
          </p>
        </div>
      </div>
    </div>
  );
}
