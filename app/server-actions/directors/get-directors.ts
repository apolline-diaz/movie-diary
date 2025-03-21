"use server";

import { PrismaClient } from "@prisma/client";

export async function getDirectors() {
  const prisma = new PrismaClient();

  try {
    const directors = await prisma.directors.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return directors;
  } catch (error) {
    console.error("Error fetching directors:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
