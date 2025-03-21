"use server";

import { Movie } from "@/app/types/movie";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMoviesByTitle = async (search: string): Promise<Movie[]> => {
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
      take: 50,
    });

    return movies;
  } else {
    const moviesByTitle = await prisma.movies.findMany({
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
      },
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    return moviesByTitle;
  }
};

export const getMoviesByKeyword = async (search: string): Promise<Movie[]> => {
  if (search.trim() === "") {
    return [];
  }

  const keywords = await prisma.keywords.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  });

  if (keywords.length > 0) {
    const keywordIds = keywords.map((k) => k.id);

    const movieKeywords = await prisma.movie_keywords.findMany({
      where: {
        keyword_id: {
          in: keywordIds,
        },
      },
      select: {
        movie_id: true,
      },
    });

    const movieIds = movieKeywords.map((mk) => mk.movie_id);

    const movies = await prisma.movies.findMany({
      where: {
        id: {
          in: movieIds,
        },
      },
      select: {
        id: true,
        title: true,
        image_url: true,
        release_date: true,
      },
    });

    return movies;
  }

  return [];
};
