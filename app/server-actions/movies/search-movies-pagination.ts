"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Types
export type MovieFilters = {
  title?: string;
  keyword?: string;
  director?: string;
  country?: string;
  genre?: string;
  year?: string;
  keywordIds?: number[];
  directorId?: bigint;
  countryId?: number;
  genreId?: bigint;
  releaseYear?: string;
  type?: string;
  page?: number;
  limit?: number;
};
// Function to fetch movies with pagination
export const fetchMoviesWithPagination = async ({
  title = "",
  keyword = "",
  director = "",
  country = "",
  genre = "",
  year = "",
  keywordIds = [],
  directorId,
  countryId,
  genreId,
  releaseYear = "",
  type = "",
  page = 1,
  limit = 20,
}: MovieFilters) => {
  // Calculate offset for pagination
  const skip = (page - 1) * limit;
  const take = limit;

  try {
    // We need to construct a query that accounts for the join tables
    // For Prisma, we'll use the 'where' clause with nested relations

    // Build base query conditions
    const where: any = {};

    if (title) {
      where.title = {
        contains: title,
        mode: "insensitive",
      };
    }

    if (type) {
      where.type = type;
    }

    if (year || releaseYear) {
      const yearToFilter = year || releaseYear;
      where.release_date = {
        startsWith: yearToFilter,
      };
    }

    // Handle relationships through junction tables
    if (keyword || keywordIds.length > 0) {
      where.movies_keywords = {
        some: {
          keywords: keyword
            ? { name: { contains: keyword, mode: "insensitive" } }
            : keywordIds.length > 0
            ? { id: { in: keywordIds } }
            : undefined,
        },
      };
    }

    if (director || directorId) {
      where.movies_directors = {
        some: {
          directors: director
            ? { name: { contains: director, mode: "insensitive" } }
            : directorId
            ? { id: directorId }
            : undefined,
        },
      };
    }

    if (country || countryId) {
      where.movies_countries = {
        some: {
          countries: country
            ? { name: { contains: country, mode: "insensitive" } }
            : countryId
            ? { id: countryId }
            : undefined,
        },
      };
    }

    if (genre || genreId) {
      where.movies_genres = {
        some: {
          genres: genre
            ? { name: { contains: genre, mode: "insensitive" } }
            : genreId
            ? { id: genreId }
            : undefined,
        },
      };
    }

    // Récupérer le nombre total de films qui correspondent aux critères
    const totalCount = await prisma.movies.count({
      where,
    });

    // Execute query to get movies with related data
    const movies = await prisma.movies.findMany({
      where,
      include: {
        movies_genres: {
          include: {
            genres: true,
          },
        },
        movies_directors: {
          include: {
            directors: true,
          },
        },
        movies_countries: {
          include: {
            countries: true,
          },
        },
        movies_keywords: {
          include: {
            keywords: true,
          },
        },
      },
      skip,
      take,
      orderBy: {
        release_date: "desc",
      },
    });

    // Transform the result to match the expected structure
    // Transformer les résultats en objets JSON simples
    const transformedMovies = movies.map((movie) => {
      // Créer un nouvel objet avec JSON.parse(JSON.stringify())
      return JSON.parse(
        JSON.stringify({
          id: movie.id.toString(), // Convertir les BigInt en string
          title: movie.title,
          release_date: movie.release_date,
          image_url: movie.image_url,
          description: movie.description,
          language: movie.language,
          runtime: movie.runtime,
          type: movie.type,
          boost: movie.boost,
          // Transformer les relations
          genres: movie.movies_genres.map((mg) => ({
            id: mg.genres.id.toString(),
            name: mg.genres.name || "",
          })),
          directors: movie.movies_directors.map((md) => ({
            id: md.directors.id.toString(),
            name: md.directors.name || "",
          })),
          countries: movie.movies_countries.map((mc) => ({
            id: mc.countries.id,
            name: mc.countries.name,
          })),
          keywords: movie.movies_keywords.map((mk) => ({
            id: mk.keywords.id,
            name: mk.keywords.name || "",
          })),
        })
      );
    });

    return {
      movies: transformedMovies,
      totalCount,
      hasMore: skip + take < totalCount,
    };
  } catch (error: any) {
    console.error("Error fetching movies:", error);
    throw new Error(`Error: ${error.message}`);
  }
};
