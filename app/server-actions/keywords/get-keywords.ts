"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
