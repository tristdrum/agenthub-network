import posthog from "posthog-js";

let initialized = false;
const defaultApiHost = "https://us.i.posthog.com";

function getBaseProperties() {
  return {
    app: "agenthub-network",
    app_environment: import.meta.env.MODE,
  };
}

function withBaseProperties(properties = {}) {
  return {
    ...getBaseProperties(),
    ...properties,
  };
}

export function isAnalyticsEnabled() {
  return Boolean(import.meta.env.VITE_POSTHOG_KEY);
}

export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY;

  if (!key || initialized) {
    return false;
  }

  posthog.init(key, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || defaultApiHost,
    autocapture: true,
    capture_pageview: false,
    capture_pageleave: true,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: true,
    },
    capture_performance: {
      network_timing: true,
      web_vitals: true,
      web_vitals_attribution: true,
    },
    defaults: "2026-01-30",
    error_tracking: {
      captureExtensionExceptions: false,
    },
    person_profiles: "identified_only",
    session_recording: {
      blockSelector: "[data-ph-no-record],.ph-no-capture",
      maskAllInputs: true,
      maskTextSelector: "[data-ph-mask-text]",
      recordBody: false,
      recordHeaders: false,
      sampleRate: 1,
      slimDOMOptions: {
        comment: true,
        script: true,
      },
      full_snapshot_interval_millis: 5 * 60 * 1000,
    },
  });

  posthog.register(getBaseProperties());
  initialized = true;
  return true;
}

export function captureEvent(eventName, properties = {}) {
  if (!initialized) {
    return;
  }

  posthog.capture(eventName, withBaseProperties(properties));
}

export function captureException(error, properties = {}) {
  if (!initialized || !error) {
    return;
  }

  posthog.captureException(error, withBaseProperties(properties));
}

export function identifyUser({ user, profile, isAnonymous }) {
  if (!initialized || !user) {
    return;
  }

  const displayName =
    profile?.display_name || user.user_metadata?.display_name || null;

  posthog.identify(
    user.id,
    withBaseProperties({
      email: user.email || undefined,
      display_name: displayName || undefined,
      is_anonymous: Boolean(isAnonymous),
      created_at: user.created_at || undefined,
    }),
    {
      first_seen_at: user.created_at || undefined,
    },
  );

  posthog.register({
    distinct_user_id: user.id,
    is_authenticated: true,
    is_anonymous: Boolean(isAnonymous),
  });
}

export function resetAnalytics() {
  if (!initialized) {
    return;
  }

  posthog.reset();
  posthog.register(getBaseProperties());
}

export function trackPageView({
  hash = "",
  pageName = null,
  pathname,
  search = "",
  title = "",
}) {
  if (!initialized) {
    return;
  }

  posthog.capture("$pageview", {
    ...withBaseProperties({
      page_hash: hash || undefined,
      page_name: pageName || undefined,
      page_path: pathname,
      page_search: search || undefined,
      page_title: title || undefined,
    }),
    $current_url: window.location.href,
    $pathname: pathname,
  });
}
