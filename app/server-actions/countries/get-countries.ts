"use server";

import db from "@/db";
import { countries } from "@/db/schema";

export async function getCountries() {
  try {
    const data = await db
      .select({
        id: countries.id,
        name: countries.name,
      })
      .from(countries)
      .orderBy(countries.name);

    return data;
  } catch (error) {
    throw new Error("Failed to fetch countries");
  }
}
