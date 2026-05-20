export function assetUrl(path) {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path;
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
