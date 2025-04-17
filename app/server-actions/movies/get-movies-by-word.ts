"use server";

import { Movie } from "@/app/types/movie";
import { prisma } from "@/lib/prisma"; // ou le chemin où se trouve votre prisma.ts

export const getMoviesByWord = async (search: string): Promise<Movie[]> => {
  // Si la recherche est vide, retourner les films récents
  if (search.trim() === "") {
    const movies = await prisma.movies.findMany({
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return movies;
  }

  // Recherche unifiée avec une seule requête utilisant des jointures
  const movies = await prisma.movies.findMany({
    where: {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        {
          movies_keywords: {
            some: {
              keywords: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
        {
          movies_directors: {
            some: {
              directors: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
        {
          movies_countries: {
            some: {
              countries: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
        {
          movies_genres: {
            some: {
              genres: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      title: true,
      image_url: true,
      release_date: true,
    },
  });

  return movies;
};
