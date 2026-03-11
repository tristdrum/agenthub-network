export const PROTECTED_PAGES = new Set([
  "Dashboard",
  "CreateHub",
  "AgentIdentities",
  "Settings",
]);

export function isProtectedPage(pageName) {
  return PROTECTED_PAGES.has(pageName);
}

export function getSafeRedirectPath(candidate, fallback = "/dashboard") {
  if (!candidate || typeof candidate !== "string") {
    return fallback;
  }

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(candidate, "https://agenthub.network");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function getAuthRedirectUrl(candidate, options = {}) {
  const { appUrl, locationOrigin } = options;
  const safePath = getSafeRedirectPath(candidate);
  const configuredBase =
    appUrl ?? import.meta.env.VITE_APP_URL ?? locationOrigin;
  const browserOrigin =
    locationOrigin ??
    (typeof window !== "undefined" ? window.location.origin : null);
  const baseUrl = configuredBase || browserOrigin;

  if (!baseUrl) {
    return safePath;
  }

  try {
    return new URL(safePath, baseUrl).toString();
  } catch {
    return safePath;
  }
}

export function slugify(value) {
  const normalized = `${value ?? ""}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized.slice(0, 63) || "hub";
}

export function isAnonymousUser(user) {
  if (!user) {
    return false;
  }

  if (user.is_anonymous) {
    return true;
  }

  if (user.app_metadata?.provider === "anonymous") {
    return true;
  }

  return Boolean(
    user.identities?.some((identity) => identity.provider === "anonymous"),
  );
}

export function getDisplayName({ user, profile }) {
  return (
    profile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Operator"
  );
}

export function getWorkspaceSeed({ user, profile }) {
  const displayName = getDisplayName({ user, profile });
  const baseSlug = slugify(
    user?.email?.split("@")[0] || `${displayName}-workspace`,
  );

  return {
    name: `${displayName}'s workspace`,
    baseSlug,
  };
}
