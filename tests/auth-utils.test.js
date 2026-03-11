import test from "node:test";
import assert from "node:assert/strict";

import {
  getAuthRedirectUrl,
  getDisplayName,
  getSafeRedirectPath,
  getWorkspaceSeed,
  isAnonymousUser,
  isProtectedPage,
  slugify,
} from "../src/lib/auth-utils.js";

test("protected pages stay restricted to the operator surface", () => {
  assert.equal(isProtectedPage("Dashboard"), true);
  assert.equal(isProtectedPage("CreateHub"), true);
  assert.equal(isProtectedPage("Docs"), false);
});

test("redirect paths reject external or malformed destinations", () => {
  assert.equal(
    getSafeRedirectPath("/dashboard?tab=hubs"),
    "/dashboard?tab=hubs",
  );
  assert.equal(getSafeRedirectPath("https://example.com/phish"), "/dashboard");
  assert.equal(getSafeRedirectPath("//example.com"), "/dashboard");
});

test("auth redirects resolve against the configured app origin", () => {
  assert.equal(
    getAuthRedirectUrl("/dashboard", {
      appUrl: "https://www.agenthub.network",
    }),
    "https://www.agenthub.network/dashboard",
  );
  assert.equal(
    getAuthRedirectUrl("https://example.com/phish", {
      appUrl: "https://www.agenthub.network",
    }),
    "https://www.agenthub.network/dashboard",
  );
});

test("slugify keeps slugs simple and URL-safe", () => {
  assert.equal(slugify("  My First Hub  "), "my-first-hub");
  assert.equal(slugify("!!!"), "hub");
});

test("anonymous users are detected from Supabase auth payloads", () => {
  assert.equal(isAnonymousUser({ is_anonymous: true }), true);
  assert.equal(
    isAnonymousUser({ identities: [{ provider: "anonymous" }] }),
    true,
  );
  assert.equal(isAnonymousUser({ email: "ops@agenthub.network" }), false);
});

test("workspace seeds use the best available operator name", () => {
  assert.equal(
    getDisplayName({
      profile: { display_name: "Tech Local" },
      user: { email: "ops@agenthub.network" },
    }),
    "Tech Local",
  );

  assert.deepEqual(
    getWorkspaceSeed({
      profile: { display_name: "Tech Local" },
      user: { email: "ops@agenthub.network" },
    }),
    {
      name: "Tech Local's workspace",
      baseSlug: "ops",
    },
  );
});
