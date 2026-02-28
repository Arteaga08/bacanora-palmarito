// backend/utils/cloudinaryOptimizer.js
export const optimizeUrl = (url, width = null) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  if (url.includes("upload/f_auto")) return url;

  let params = "f_auto,q_auto";

  if (width) params += `,w_${width}`;

  return url.replace("/upload/", `/upload/${params}/`);
};
