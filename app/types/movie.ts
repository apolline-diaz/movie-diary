import { Director } from "./director";
import { Genre } from "./genre";
import { Keyword } from "./keyword";
import { Country } from "./country";

export type Movie = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  release_date: string;
  runtime: number;
  directors: Director[];
  genres: Genre[];
  keywords: Keyword[];
  countries: Country[];
};
