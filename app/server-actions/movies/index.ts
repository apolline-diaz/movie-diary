"use server";

import { supabase } from "@/lib/supabase";

interface Movie {
  id: string;
  title: string;
  imageUrl: string | null;
  releaseDate: string | null;
}

export async function getTopMovies() {
  const { data, error } = await supabase
    .from("movies")
    .select(`id, title, image_url, description, release_date`)
    .eq("boost", true)
    .range(0, 1);

  if (error) throw new Error(error.message);
  return data;
}

export async function getMoviesByGenre(genreId: number) {
  const { data, error } = await supabase
    .from("movies")
    .select(
      `
      id, 
      title, 
      image_url, 
      release_date,
      movie_genres!inner(genre_id),
      genres:movie_genres!inner(genres(name))
      `
    )
    .eq("movie_genres.genre_id", genreId)
    .order("created_at", { ascending: false })
    .range(0, 10);

  if (error) throw new Error(error.message);
  return data;
}

export async function getMoviesByYearRange(
  startYear: string,
  endYear: string
): Promise<Movie[]> {
  try {
    console.log(`Recherche de films entre ${startYear} et ${endYear}`);

    // Format the date ranges
    const startDate = `${startYear}-01-01`;
    const endDate = `${endYear}-12-31`;

    // Query using Supabase
    const { data, error } = await supabase
      .from("movies")
      .select("id, title, image_url, release_date")
      .gte("release_date", startDate)
      .lte("release_date", endDate)
      .order("created_at", { ascending: true })
      .limit(15);

    if (error) {
      console.error("Erreur Supabase:", error);
      throw new Error(`Failed to fetch movies by year range: ${error.message}`);
    }

    console.log(
      `${data?.length || 0} films trouvés entre ${startYear} et ${endYear}`
    );

    // Transform the data to match your expected format
    const movies: Movie[] =
      data?.map((movie) => ({
        id: movie.id,
        title: movie.title,
        imageUrl: movie.image_url,
        releaseDate: movie.release_date,
      })) || [];

    return movies;
  } catch (error) {
    console.error("Erreur lors de la recherche par année:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch movies by year range"
    );
  }
}
