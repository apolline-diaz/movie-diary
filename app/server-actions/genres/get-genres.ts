"use server";

import { PrismaClient } from "@prisma/client";

export async function getGenres() {
  const prisma = new PrismaClient();

  try {
    const genres = await prisma.genres.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
