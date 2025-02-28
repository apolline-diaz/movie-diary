"use server";

import { supabase } from "@/lib/supabase";

// Movie interface for type safety
interface Movie {
  id: string;
  title: string;
  imageUrl: string | null;
  releaseDate: string | null;
}

export async function searchMoviesByTitle(title: string): Promise<Movie[]> {
  try {
    console.log("Recherche de films avec le titre :", title);

    let query = supabase
      .from("movies")
      .select("id, title, image_url, release_date");

    if (!title.trim()) {
      // Si pas de titre fourni, renvoyer tous les films récents
      console.log("Récupération des films récents");

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Erreur Supabase:", error);
        return [];
      }

      console.log("Films récents récupérés :", data?.length || 0);

      // Transform the data to match your expected format
      const movies: Movie[] =
        data?.map((movie) => ({
          id: movie.id,
          title: movie.title,
          imageUrl: movie.image_url,
          releaseDate: movie.release_date,
        })) || [];

      return movies;
    } else {
      // Recherche des films correspondant au titre
      console.log("Recherche de films correspondant à :", title);

      const { data, error } = await query
        .ilike("title", `%${title}%`)
        .limit(100);

      if (error) {
        console.error("Erreur Supabase:", error);
        return [];
      }

      console.log("Nombre de films trouvés :", data?.length || 0);

      // Transform the data to match your expected format
      const movies: Movie[] =
        data?.map((movie) => ({
          id: movie.id,
          title: movie.title,
          imageUrl: movie.image_url,
          releaseDate: movie.release_date,
        })) || [];

      return movies;
    }
  } catch (error) {
    console.error("Erreur lors de la recherche par titre:", error);
    return [];
  }
}
