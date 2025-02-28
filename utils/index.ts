export const getCanonicalUrl = () => {
  return process.env.NODE_ENV !== "production"
    ? "https://movie-diary-ten.vercel.app/"
    : "http://localhost:3000";
};

export const getImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) {
    return "/public/assets/diary";
  }
  // Si l'URL commence par "https://" ou "http://", on considère que c'est une URL externe complète
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl; // URL externe (ex: image MUBI), on la retourne telle quelle
  }

  // Sinon, on considère que c'est une image stockée dans Supabase et on ajoute l'URL de base de Supabase
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${imageUrl}`;
};
