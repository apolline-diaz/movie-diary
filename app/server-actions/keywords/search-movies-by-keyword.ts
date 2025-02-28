"use server";

import db from "@/db";
import { movies, keywords, movieKeywords } from "@/db/schema";
import { ilike, inArray } from "drizzle-orm";

export async function searchMoviesByKeyword(keyword: string) {
  try {
    if (!keyword.trim()) {
      return []; // Pas de mot-clé fourni, on ne renvoie rien
    }

    // Récupérer les IDs des mots-clés correspondants
    const keywordRecords = await db
      .select({ id: keywords.id })
      .from(keywords)
      .where(ilike(keywords.name, `%${keyword}%`));

    if (!keywordRecords.length) return [];

    const keywordIds = keywordRecords.map((k) => k.id);

    // Trouver les films liés à ces mots-clés
    const movieKeywordRecords = await db
      .select({ movieId: movieKeywords.movieId })
      .from(movieKeywords)
      .where(inArray(movieKeywords.keywordId, keywordIds));

    if (!movieKeywordRecords.length) return [];

    const movieIds = movieKeywordRecords.map((mk) => mk.movieId);

    // Récupérer les films associés
    const moviesByKeyword = await db
      .select({
        id: movies.id,
        title: movies.title,
        imageUrl: movies.imageUrl,
        releaseDate: movies.releaseDate,
      })
      .from(movies)
      .where(inArray(movies.id, movieIds))
      .limit(100);

    return moviesByKeyword;
  } catch (error) {
    console.error("Erreur lors de la recherche par mot-clé:", error);
    return [];
  }
}
