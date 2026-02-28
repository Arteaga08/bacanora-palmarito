export const sanitizeUrl = (url, fallback = "") => {
  if (!url || typeof url !== "string") return fallback;

  // Pasamos a minúsculas solo para la validación
  const lowUrl = url.toLowerCase().trim();

  const isSafe =
    lowUrl.startsWith("https://") ||
    lowUrl.startsWith("http://") ||
    lowUrl.startsWith("/");
  lowUrl.startsWith("data:image/");

  return isSafe ? url : fallback;
};
