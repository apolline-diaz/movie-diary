"use server";

import db from "@/db";
import { genres, movieGenres, movies } from "@/db/schema";
import { supabase } from "@/lib/supabase";
import { eq, and, gte, lte } from "drizzle-orm";

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

export async function getMoviesByYearRange(startYear: string, endYear: string) {
  try {
    const data = await db
      .select({
        id: movies.id,
        title: movies.title,
        imageUrl: movies.imageUrl,
        releaseDate: movies.releaseDate,
        // genre: genres.name,
      })
      .from(movies)
      // .innerJoin(movieGenres, eq(movies.id, movieGenres.movieId))
      // .innerJoin(genres, eq(movieGenres.genreId, genres.id))
      .where(
        and(
          gte(movies.releaseDate, `${startYear}-01-01`),
          lte(movies.releaseDate, `${endYear}-12-31`)
        )
      )
      .orderBy(movies.createdAt)
      .limit(15);

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch movies by year range"
    );
  }
}
