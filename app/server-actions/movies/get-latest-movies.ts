"use server";

import { prisma } from "@/lib/prisma"; // à adapter selon ton path réel

export const getLatestMovies = async () => {
  try {
    const movies = await prisma.movies.findMany({
      orderBy: { created_at: "desc" },
      take: 12, // ou 6 ou 20 selon le nombre voulu
      include: {
        movies_genres: {
          include: { genres: true },
        },
        movies_directors: {
          include: { directors: true },
        },
        movies_countries: {
          include: { countries: true },
        },
        movies_keywords: {
          include: { keywords: true },
        },
      },
    });

    // Transformation optionnelle du résultat
    return movies;
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers films :", error);
    return [];
  }
};
