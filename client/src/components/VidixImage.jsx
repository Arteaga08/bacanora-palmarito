// src/components/VidixImage.jsx
import React from "react";

const VidixImage = ({
  src,
  alt,
  className = "",
  priority = false,
  widths = [450, 800, 1200, 1920],
  fill = false,
}) => {
  if (!src) return null;

  // 1. Limpieza de URL (Súper importante para Vidix Studio)
  // Esta lógica elimina cualquier parámetro que venga del backend (f_auto, q_auto, etc.)
  // para reconstruir la URL limpia con el ancho que necesitamos.
  const getOptimizedUrl = (w) => {
    if (!src.includes("res.cloudinary.com")) return src;

    // Separamos la URL en: [antes de /upload/, después de /upload/]
    const parts = src.split("/upload/");
    const baseUrl = parts[0];
    // Buscamos el final de cualquier parámetro previo (buscando la 'v' de versión o el public_id)
    const restOfUrl = parts[1]
      .split("/")
      .filter((p) => !p.includes("_auto") && !p.startsWith("w_"))
      .join("/");

    return `${baseUrl}/upload/f_auto,q_auto,w_${w}/${restOfUrl}`;
  };

  const srcSet = widths.map((w) => `${getOptimizedUrl(w)} ${w}w`).join(", ");
  const fallbackSrc = getOptimizedUrl(1200);

  return (
    <img
      src={fallbackSrc}
      srcSet={srcSet}
      sizes="100vw"
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchpriority={priority ? "high" : "auto"}
      style={{
        width: "100%",
        height: fill ? "100%" : "auto",
        objectFit: fill ? "cover" : "unset",
        display: "block",
      }}
    />
  );
};

export default VidixImage;
