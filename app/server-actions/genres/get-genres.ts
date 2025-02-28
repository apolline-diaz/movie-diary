"use server";

import db from "@/db";
import { genres } from "@/db/schema";

export async function getGenres() {
  try {
    const data = await db
      .select({
        id: genres.id,
        name: genres.name,
      })
      .from(genres)
      .orderBy(genres.name);

    return data;
  } catch (error) {
    throw new Error("Failed to fetch genres");
  }
}
