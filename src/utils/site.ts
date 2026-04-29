export const site = {
  name: "Florida Property Tax Tracker",
  description:
    "A neutral civic tracker for Florida's 2026 property tax elimination proposals, related reforms, legislative status, county impacts, source documents, and expected next steps.",
  url: (
    import.meta.env.PUBLIC_CANONICAL_URL || "https://fl-tax.jenny.media"
  ).replace(/\/$/, ""),
  deploymentUrl: (
    import.meta.env.PUBLIC_SITE_URL ||
    import.meta.env.PUBLIC_CANONICAL_URL ||
    "https://fl-tax.jenny.media"
  ).replace(/\/$/, ""),
  repoUrl:
    import.meta.env.PUBLIC_REPOSITORY_URL ||
    "https://github.com/xcv58/florida-property-tax-tracker",
  defaultImage: "/og-image.png",
  indexing: import.meta.env.PUBLIC_INDEXING !== "false",
};

export const correctionUrl = `${site.repoUrl}/issues/new/choose`;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBase(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return path;
  }

  if (!basePath) {
    return path;
  }

  return path === "/" ? `${basePath}/` : `${basePath}${path}`;
}

export function withoutBase(pathname: string): string {
  if (!basePath || !pathname.startsWith(basePath)) {
    return pathname;
  }

  return pathname.slice(basePath.length) || "/";
}

export function canonicalUrlForPath(pathname: string): string {
  const path = withoutBase(pathname);
  return new URL(path, site.url).href;
}

export function absoluteCanonicalUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return new URL(path, site.url).href;
}
