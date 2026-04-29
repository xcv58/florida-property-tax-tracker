export const site = {
  name: "Florida Property Tax Tracker",
  description:
    "A neutral civic tracker for Florida's 2026 property tax elimination proposals, related reforms, legislative status, county impacts, source documents, and expected next steps.",
  repoUrl:
    import.meta.env.PUBLIC_REPOSITORY_URL ||
    "https://github.com/xcv58/florida-property-tax-tracker",
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
