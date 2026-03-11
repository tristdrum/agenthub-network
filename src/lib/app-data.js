// @ts-nocheck
import { getWorkspaceSeed, slugify } from "@/lib/auth-utils";
import { requireSupabaseClient } from "@/lib/supabase";

const HUB_FIELDS = [
  "id",
  "workspace_id",
  "name",
  "slug",
  "objective",
  "contribution_rules",
  "visibility",
  "created_at",
].join(", ");

function getSupabaseErrorMessage(error, fallback) {
  return error?.message || fallback;
}

function getRandomSuffix() {
  return Math.random().toString(36).slice(2, 8);
}

function getRandomToken(length) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function loadProfile(userId) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(getSupabaseErrorMessage(error, "Unable to load profile."));
  }

  return data;
}

export async function updateDisplayName(userId, displayName) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ display_name: displayName || null })
    .eq("id", userId)
    .select("id, display_name, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(error, "Unable to update your profile."),
    );
  }

  return data;
}

export async function loadUserWorkspaces() {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("id, name, slug, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(error, "Unable to load workspaces."),
    );
  }

  return data ?? [];
}

export async function ensurePersonalWorkspace({ user, profile }) {
  const workspaces = await loadUserWorkspaces();

  if (workspaces[0]) {
    return workspaces[0];
  }

  const supabase = requireSupabaseClient();
  const seed = getWorkspaceSeed({ user, profile });

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const slug =
      attempt === 0 ? seed.baseSlug : `${seed.baseSlug}-${getRandomSuffix()}`;
    const { data: workspace, error: workspaceError } = await supabase.rpc(
      "create_workspace_with_owner",
      {
        workspace_name: seed.name,
        workspace_slug: slug,
      },
    );

    if (workspaceError?.code === "23505") {
      continue;
    }

    if (workspaceError) {
      throw new Error(
        getSupabaseErrorMessage(
          workspaceError,
          "Unable to create your workspace.",
        ),
      );
    }

    return workspace;
  }

  throw new Error("Unable to allocate a unique workspace slug.");
}

export async function loadDashboardData() {
  const supabase = requireSupabaseClient();
  const workspaces = await loadUserWorkspaces();

  if (!workspaces.length) {
    return { workspaces, hubs: [] };
  }

  const workspaceIds = workspaces.map((workspace) => workspace.id);
  const workspaceById = new Map(
    workspaces.map((workspace) => [workspace.id, workspace]),
  );

  const { data: hubs, error: hubsError } = await supabase
    .from("hubs")
    .select(HUB_FIELDS)
    .in("workspace_id", workspaceIds)
    .order("created_at", { ascending: false });

  if (hubsError) {
    throw new Error(getSupabaseErrorMessage(hubsError, "Unable to load hubs."));
  }

  const hubIds = (hubs ?? []).map((hub) => hub.id);
  let activeAgentCountByHub = new Map();

  if (hubIds.length) {
    const { data: identities, error: identitiesError } = await supabase
      .from("agent_identities")
      .select("hub_id, revoked_at")
      .in("hub_id", hubIds);

    if (identitiesError) {
      throw new Error(
        getSupabaseErrorMessage(
          identitiesError,
          "Unable to load agent identities.",
        ),
      );
    }

    activeAgentCountByHub = new Map();
    for (const identity of identities ?? []) {
      if (identity.revoked_at) {
        continue;
      }

      const current = activeAgentCountByHub.get(identity.hub_id) ?? 0;
      activeAgentCountByHub.set(identity.hub_id, current + 1);
    }
  }

  return {
    workspaces,
    hubs: (hubs ?? []).map((hub) => ({
      ...hub,
      workspace_name: workspaceById.get(hub.workspace_id)?.name ?? "Workspace",
      active_agent_count: activeAgentCountByHub.get(hub.id) ?? 0,
    })),
  };
}

export async function createHub({ user, profile, hub }) {
  const supabase = requireSupabaseClient();
  const workspace = await ensurePersonalWorkspace({ user, profile });
  const slug = slugify(hub.name);

  const { data, error } = await supabase
    .from("hubs")
    .insert({
      workspace_id: workspace.id,
      name: hub.name,
      slug,
      objective: hub.objective.trim(),
      contribution_rules: hub.contributionRules?.trim() || null,
      visibility: hub.visibility,
      created_by: user.id,
    })
    .select(HUB_FIELDS)
    .single();

  if (error) {
    throw new Error(getSupabaseErrorMessage(error, "Unable to create hub."));
  }

  return data;
}

export async function loadHubDetails(slug) {
  const supabase = requireSupabaseClient();
  let hub = null;
  let canManage = false;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    const workspaces = await loadUserWorkspaces();

    if (workspaces.length) {
      const { data: ownedHub, error: ownedHubError } = await supabase
        .from("hubs")
        .select(HUB_FIELDS)
        .eq("slug", slug)
        .in(
          "workspace_id",
          workspaces.map((workspace) => workspace.id),
        )
        .maybeSingle();

      if (ownedHubError) {
        throw new Error(
          getSupabaseErrorMessage(ownedHubError, "Unable to load hub."),
        );
      }

      if (ownedHub) {
        hub = ownedHub;
        canManage = true;
      }
    }
  }

  if (!hub) {
    const { data: publicHub, error: publicHubError } = await supabase
      .from("hubs")
      .select(HUB_FIELDS)
      .eq("slug", slug)
      .eq("visibility", "public")
      .maybeSingle();

    if (publicHubError) {
      throw new Error(
        getSupabaseErrorMessage(publicHubError, "Unable to load hub."),
      );
    }

    if (!publicHub) {
      return null;
    }

    hub = publicHub;
  }

  const { data: identities, error: identitiesError } = await supabase
    .from("agent_identities")
    .select(
      "id, hub_id, label, core_agent_id, api_key_fingerprint, revoked_at, created_at",
    )
    .eq("hub_id", hub.id)
    .order("created_at", { ascending: false });

  if (identitiesError && canManage) {
    throw new Error(
      getSupabaseErrorMessage(
        identitiesError,
        "Unable to load agent identities.",
      ),
    );
  }

  return {
    hub,
    identities: identities ?? [],
    canManage,
  };
}

export async function loadAgentIdentityPageData() {
  const supabase = requireSupabaseClient();
  const { hubs } = await loadDashboardData();

  if (!hubs.length) {
    return { hubs, identities: [] };
  }

  const { data, error } = await supabase
    .from("agent_identities")
    .select(
      "id, hub_id, label, core_agent_id, api_key_fingerprint, revoked_at, created_at",
    )
    .in(
      "hub_id",
      hubs.map((hub) => hub.id),
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(error, "Unable to load agent identities."),
    );
  }

  return {
    hubs,
    identities: data ?? [],
  };
}

export async function createAgentIdentity({ hubId, label, userId }) {
  const supabase = requireSupabaseClient();
  const token = `ah_live_${getRandomToken(32)}`;
  const apiKeyHash = await sha256(token);
  const coreAgentId = `agent_${getRandomToken(10)}`;

  const { data, error } = await supabase
    .from("agent_identities")
    .insert({
      hub_id: hubId,
      label: label.trim(),
      core_agent_id: coreAgentId,
      api_key_fingerprint: apiKeyHash.slice(0, 12),
      api_key_hash: apiKeyHash,
      created_by: userId,
    })
    .select(
      "id, hub_id, label, core_agent_id, api_key_fingerprint, revoked_at, created_at",
    )
    .single();

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(error, "Unable to create agent identity."),
    );
  }

  return {
    identity: data,
    token,
  };
}

export async function revokeAgentIdentity(identityId) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from("agent_identities")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", identityId)
    .select("id, revoked_at")
    .single();

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(error, "Unable to revoke the agent identity."),
    );
  }

  return data;
}
