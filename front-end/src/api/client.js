const API_BASE = import.meta.env.VITE_API_BASE ?? "";

function joinUrl(path) {
  const base = API_BASE.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function fetchJson(path, options = {}) {
  const res = await fetch(joinUrl(path), {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }
  if (!res.ok) {
    const msg =
      body?.message || body?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body;
}

export function assetUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return joinUrl(path.startsWith("/") ? path : `/${path}`);
}

export function getArticles() {
  return fetchJson("/api/articles");
}

export function getArticleById(id) {
  return fetchJson(`/api/articles/${encodeURIComponent(id)}`);
}

export function getCategories() {
  return fetchJson("/api/categories");
}

export function getSources() {
  return fetchJson("/api/sources");
}
