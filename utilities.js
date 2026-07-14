// Shared utilities for persistence, input safety, accessibility, and media handling.
export const STORAGE_KEY = "premiumBirthdayExperience:v2";

export function sanitizeText(value, maxLength = 800) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeUrl(value) {
  const raw = sanitizeText(value, 1200);
  if (!raw) return "";
  try {
    const url = new URL(raw, window.location.href);
    return ["http:", "https:", "data:", "blob:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

export function safeJsonParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function saveState(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn("Birthday site preferences could not be saved.");
  }
}

export function loadState() {
  return safeJsonParse(localStorage.getItem(STORAGE_KEY), null);
}

export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function validateImageFile(file, maxSizeMb = 7) {
  if (!file) return { ok: true };
  if (!file.type || !file.type.startsWith("image/")) {
    return { ok: false, message: "Please choose a valid image file." };
  }
  if (file.size > maxSizeMb * 1024 * 1024) {
    return { ok: false, message: `Please choose an image smaller than ${maxSizeMb} MB.` };
  }
  const url = URL.createObjectURL(file);
  try {
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    return { ok: true };
  } catch {
    return { ok: false, message: "That image appears to be broken. Please choose another one." };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function makeImage(src, alt = "", className = "") {
  const img = document.createElement("img");
  img.src = sanitizeUrl(src);
  img.alt = sanitizeText(alt, 120);
  img.loading = "lazy";
  img.decoding = "async";
  if (className) img.className = className;
  return img;
}
