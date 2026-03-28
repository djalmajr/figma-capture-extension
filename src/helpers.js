export const FILE_KEY_RE = /^[a-zA-Z0-9_-]+$/;

export const HASH = (key) => `#figmacapture=${key}&figmaselector=body`;

export function esc(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function generateId() {
  return crypto.randomUUID().slice(0, 8);
}

export function cleanHash(hash) {
  const cleaned = hash
    .replace(/[#&]?figmacapture=[^&]*/g, "")
    .replace(/[#&]?figmaselector=[^&]*/g, "")
    .replace(/^#?&/, "#");
  return cleaned === "#" || cleaned === "" ? "" : cleaned;
}
