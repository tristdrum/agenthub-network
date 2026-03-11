const PAGE_URL_OVERRIDES: Record<string, string> = {
  Home: "/",
  Docs: "/docs",
};

export function createPageUrl(pageName: string) {
  return PAGE_URL_OVERRIDES[pageName] ?? `/${pageName.replace(/ /g, "-")}`;
}
