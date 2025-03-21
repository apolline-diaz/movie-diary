"use server";

import { PrismaClient } from "@prisma/client";

export async function getMovie(id: string) {
  const prisma = new PrismaClient();

  try {
    const movie = await prisma.movies.findUnique({
      where: {
        id: id,
      },
      include: {
        movie_genres: {
          include: {
            genres: true,
          },
        },
        movie_keywords: {
          include: {
            keywords: true,
          },
        },
        movie_directors: {
          include: {
            directors: true,
          },
        },
        movie_countries: {
          include: {
            countries: true,
          },
        },
      },
    });

    if (!movie) {
      return { movie: null, error: "Movie not found" };
    }

    // Transform the data to match the format expected by the UI
    const transformedMovie = {
      ...movie,
      runtime: movie.runtime ? Number(movie.runtime) : null,
      genres: movie.movie_genres.map((g) => g.genres),
      keywords: movie.movie_keywords.map((k) => k.keywords),
      directors: movie.movie_directors.map((d) => d.directors),
      countries: movie.movie_countries.map((c) => c.countries),
    };

    return { movie: transformedMovie, error: null };
  } catch (error) {
    console.error("Error fetching movie:", error);
    return {
      movie: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  } finally {
    await prisma.$disconnect();
  }
}
