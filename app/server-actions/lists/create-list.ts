"use server";

import { supabase } from "@/lib/supabase";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

// initialize Prisma client
const prisma = new PrismaClient();

export async function createList(prevState: any, formData: FormData) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      type: "error",
      message: "User not authenticated",
    };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const movieIds = (formData.get("movie_id") as string)
    .split(",")
    .filter(Boolean);

  if (!title) {
    return {
      type: "error",
      message: "Title is required",
      errors: { title: ["Title is required"] },
    };
  }

  try {
    const list = await prisma.lists.create({
      data: {
        title,
        description,
        user_id: user.id,
        lists_movies: {
          create: movieIds.map((movieId) => ({ movie_id: movieId })),
        },
      },
    });

    revalidatePath("/lists");
    return {
      type: "success",
      message: "List created successfully!",
    };
  } catch (err) {
    console.error("Error creating list:", err);
    return {
      type: "error",
      message: "Failed to create list",
    };
  }
}
