"use server";

import db from "@/db";
import { keywords } from "@/db/schema";

export async function getKeywords() {
  try {
    const data = await db
      .select({
        id: keywords.id,
        name: keywords.name,
      })
      .from(keywords)
      .orderBy(keywords.name);

    return data;
  } catch (error) {
    throw new Error("Failed to fetch keywords");
  }
}
