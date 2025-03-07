"use server";
import { PrismaClient } from "@prisma/client";

// initialize Prisma client
const prisma = new PrismaClient();

// get movie by Id

export async function getMovie(movieId: string) {
  try {
    const movie = await prisma.movies.findUnique({
      where: { id: movieId },
      include: {
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
      },
    });

    if (!movie) {
      return { error: "Film introuvable" };
    }

    // Reformat directors for direct access to names
    const directors = movie.movie_directors.map((md) => md.directors);

    // Reformat other relationships
    const countries = movie.movie_countries.map((mc) => mc.countries);
    const genres = movie.movie_genres.map((mg) => mg.genres);
    const keywords = movie.movie_keywords.map((mk) => mk.keywords);

    return {
      movie: {
        ...movie,
        directors,
        countries,
        genres,
        keywords,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du film :", error);
    return { error: "Une erreur est survenue" };
  }
}
