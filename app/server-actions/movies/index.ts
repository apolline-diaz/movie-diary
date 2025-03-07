"use server";
import { PrismaClient } from "@prisma/client";

// Initialisez le client Prisma
const prisma = new PrismaClient();

export async function getTopMovies() {
  try {
    const movies = await prisma.movies.findMany({
      where: {
        boost: true,
      },
      select: {
        id: true,
        title: true,
        image_url: true,
        description: true,
        release_date: true,
      },
      take: 2, // équivalent à range(0, 1)
    });

    return movies;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue";
    throw new Error(
      `Erreur lors de la récupération des films: ${errorMessage}`
    );
  }
}

export async function getMoviesByGenre(genreId: number) {
  try {
    const movies = await prisma.movies.findMany({
      where: {
        movie_genres: {
          some: {
            genre_id: genreId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
        movie_genres: {
          include: {
            genres: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: 15, // équivalent à range(0, 10)
    });

    return movies;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue";
    throw new Error(
      `Erreur lors de la récupération des films par genre: ${errorMessage}`
    );
  }
}

export async function getMoviesByYearRange(startYear: string, endYear: string) {
  try {
    const movies = await prisma.movies.findMany({
      where: {
        release_date: {
          gte: startYear,
          lte: endYear,
        },
      },
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
        movie_genres: {
          include: {
            genres: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: 15, // équivalent à range(0, 10)
    });

    return movies;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue";
    throw new Error(
      `Erreur lors de la récupération des films par année: ${errorMessage}`
    );
  }
}
