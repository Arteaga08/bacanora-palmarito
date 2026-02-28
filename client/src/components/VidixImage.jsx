import React from "react";
import { sanitizeUrl } from "../../../server/utils/security";

const VidixImage = ({
  src,
  alt,
  className = "",
  priority = false,
  widths = [450, 800, 1200, 1920],
  fill = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}) => {
  // 🛡️ AQUÍ ESTÁ LA LLAMADA: Filtramos el src antes de que toque cualquier otra lógica
  const safeSrc = sanitizeUrl(src);

  // Si el filtro detecta algo raro (o no hay imagen), abortamos la misión
  if (!safeSrc) return null;

  const getOptimizedUrl = (w) => {
    // 🌟 IMPORTANTE: A partir de aquí, solo usamos safeSrc
    if (!safeSrc.includes("res.cloudinary.com")) return safeSrc;

    const [baseUrl, rest] = safeSrc.split("/upload/");

    const cleanPath = rest
      .split("/")
      .filter((part) => {
        return (
          !part.startsWith("w_") &&
          !part.startsWith("f_") &&
          !part.startsWith("q_") &&
          !part.startsWith("c_")
        );
      })
      .join("/");

    return `${baseUrl}/upload/f_auto,q_auto,w_${w}/${cleanPath}`;
  };

  // Generamos todo basándonos en la URL ya sanitizada
  const srcSet = widths.map((w) => `${getOptimizedUrl(w)} ${w}w`).join(", ");
  const fallbackSrc = getOptimizedUrl(widths[1] || 800);

  return (
    <img
      src={fallbackSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      style={{
        width: "100%",
        height: fill ? "100%" : "auto",
        objectFit: fill ? "cover" : "unset",
        display: "block",
        aspectRatio: fill ? "unset" : "auto",
      }}
    />
  );
};

export default VidixImage;
