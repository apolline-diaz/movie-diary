"use server";

import { supabase } from "@/lib/supabase";
import { PrismaClient } from "@prisma/client";
import { getUser } from "@/lib/auth"; // Helper to get the current user

const prisma = new PrismaClient();

export async function getUserLists() {
  try {
    // Get the authenticated user
    const user = await getUser();
    if (!user) return { error: "User not authenticated" };

    // Fetch the user's lists and related movies
    const lists = await prisma.lists.findMany({
      where: { user_id: user.id },
      include: {
        lists_movies: {
          include: {
            movies: true, // Fetch movies inside the lists
          },
        },
      },
    });

    return lists.map((list) => ({
      id: list.id,
      title: list.title,
      movies: list.lists_movies.map((lm) => lm.movies),
    }));
  } catch (error) {
    console.error("Error fetching lists:", error);
    return { error: "Failed to fetch lists" };
  }
}
