export const getCanonicalUrl = () => {
  return process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "http://localhost:3000";
};

export const getImageUrl = (image_url: string) => {
  // Si l'URL commence par "https://" ou "http://", on considère que c'est une URL externe complète
  if (image_url.startsWith("http://") || image_url.startsWith("https://")) {
    return image_url; // URL externe (ex: image MUBI), on la retourne telle quelle
  }

  // Sinon, on considère que c'est une image stockée dans Supabase et on ajoute l'URL de base de Supabase
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${image_url}`;
};
