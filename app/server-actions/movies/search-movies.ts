// app/actions/movieActions.ts
"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCountries() {
  try {
    const countries = await prisma.countries.findMany({
      orderBy: { name: "asc" },
    });
    return countries.map((country) => ({
      value: country.id.toString(),
      label: country.name,
    }));
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}

export async function getGenres() {
  try {
    const genres = await prisma.genres.findMany({
      orderBy: { name: "asc" },
      where: { name: { not: null } },
    });
    return genres.map((genre) => ({
      value: genre.id.toString(),
      label: genre.name || "",
    }));
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

export async function getKeywords() {
  try {
    const keywords = await prisma.keywords.findMany({
      orderBy: { name: "asc" },
      where: { name: { not: null } },
    });
    return keywords.map((keyword) => ({
      value: keyword.id.toString(),
      label: keyword.name || "",
    }));
  } catch (error) {
    console.error("Error fetching keywords:", error);
    return [];
  }
}

export async function getReleaseYears() {
  try {
    const movies = await prisma.movies.findMany({
      select: { release_date: true },
      where: { release_date: { not: null } },
    });

    // Extract years from release_date strings
    const years = new Set<string>();
    movies.forEach((movie) => {
      if (movie.release_date) {
        const year = movie.release_date.substring(0, 4);
        if (/^\d{4}$/.test(year)) {
          years.add(year);
        }
      }
    });

    // Convert to array, sort in descending order (newest first)
    const sortedYears = Array.from(years).sort(
      (a, b) => parseInt(b) - parseInt(a)
    );

    return sortedYears.map((year) => ({
      value: year,
      label: year,
    }));
  } catch (error) {
    console.error("Error fetching release years:", error);
    return [];
  }
}

export async function searchMovies({
  countryId,
  genreId,
  keywordId,
  releaseYear,
}: {
  countryId?: string;
  genreId?: string;
  keywordId?: string;
  releaseYear?: string;
}) {
  try {
    // Start with basic query
    let query: any = {
      include: {
        movie_countries: true,
        movie_genres: true,
        movie_keywords: true,
      },
      where: {},
      orderBy: {
        created_at: "desc",
      },
    };

    // Add filters based on parameters
    if (countryId) {
      query.where.movie_countries = {
        some: {
          country_id: parseInt(countryId),
        },
      };
    }

    if (genreId) {
      query.where.movie_genres = {
        some: {
          genre_id: BigInt(genreId),
        },
      };
    }

    if (keywordId) {
      query.where.movie_keywords = {
        some: {
          keyword_id: parseInt(keywordId),
        },
      };
    }

    if (releaseYear) {
      query.where.release_date = {
        startsWith: releaseYear,
      };
    }

    const movies = await prisma.movies.findMany(query);

    return movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      image_url: movie.image_url || "",
      release_date: movie.release_date || "",
    }));
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
}
