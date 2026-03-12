export const PAGE_URLS: Record<string, string> = {
  Home: "/",
  About: "/about",
  AgentIdentities: "/agent-identities",
  Blog: "/blog",
  BlogPost: "/blog-post",
  Compare: "/compare",
  Contact: "/contact",
  CreateHub: "/create-hub",
  Dashboard: "/dashboard",
  Docs: "/docs",
  HubDetail: "/hub",
  Interest: "/interest",
  OpenSource: "/open-source",
  Pricing: "/pricing",
  Privacy: "/privacy",
  PublicHubs: "/public-hubs",
  Settings: "/settings",
  Start: "/start",
  Status: "/status",
  Terms: "/terms",
};

export function createPageUrl(pageName: string) {
  return PAGE_URLS[pageName] ?? `/${pageName.replace(/ /g, "-").toLowerCase()}`;
}
