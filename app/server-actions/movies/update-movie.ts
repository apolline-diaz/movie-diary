"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export type UpdateMovieInput = {
  id: string;
  title: string;
  description: string | null;
  release_date: string | null;
  language: string | null;
  runtime: number | null;
  image_url: string | null;
  image: File | null;
  director_id: string;
  director: string;
  country_id: string;
  country: string;
  genre_ids: string[];
  genres: string[];
  keyword_ids: string[];
  keywords: string[];
};

export async function updateMovie(movie: UpdateMovieInput) {
  const prisma = new PrismaClient();

  try {
    let imageUrl = movie.image_url;

    if (movie.image && movie.image instanceof File) {
      const filename = `${Date.now()}-${movie.image.name.replace(/\s+/g, "-")}`;
      const file = movie.image;

      const { data, error } = await supabase.storage
        .from("storage")
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw new Error(error.message);
      }
      imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/storage/${data?.path}`;
    }

    const runtimeValue = movie.runtime ? Number(movie.runtime) : null;

    await prisma.movies.update({
      where: { id: movie.id },
      data: {
        title: movie.title,
        description: movie.description,
        release_date: movie.release_date,
        language: movie.language,
        runtime: runtimeValue,
        image_url: imageUrl,
        director: movie.director,
        country: movie.country,
        updated_at: new Date(),
      },
    });

    // Update genres & keywords
    await prisma.movie_genres.deleteMany({ where: { movie_id: movie.id } });
    await prisma.movie_keywords.deleteMany({ where: { movie_id: movie.id } });

    for (const genreName of movie.genres) {
      let genre = await prisma.genres.findFirst({ where: { name: genreName } });
      if (!genre)
        genre = await prisma.genres.create({ data: { name: genreName } });
      await prisma.movie_genres.create({
        data: { movie_id: movie.id, genre_id: genre.id },
      });
    }

    for (const keywordName of movie.keywords) {
      let keyword = await prisma.keywords.findFirst({
        where: { name: keywordName },
      });
      if (!keyword)
        keyword = await prisma.keywords.create({ data: { name: keywordName } });
      await prisma.movie_keywords.create({
        data: { movie_id: movie.id, keyword_id: keyword.id },
      });
    }

    // Revalidate UI
    revalidatePath(`/movies/${movie.id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating movie:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  } finally {
    await prisma.$disconnect();
  }
}
