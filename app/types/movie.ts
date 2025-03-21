import { Director } from "./director";
import { Genre } from "./genre";
import { Keyword } from "./keyword";
import { Country } from "./country";

export type Movie = {
  id: string;
  title: string;
  description?: string | null;
  release_date?: string | null;
  language?: string | null;
  runtime?: number | null;
  image_url?: string | null;
  boost?: boolean | null;
  director?: string | null;
  country?: string | null;
  genres?: Genre[];
  keywords?: Keyword[];
  directors?: Director[];
  countries?: Country[];
  created_at?: Date | null;
  updated_at?: Date | null;
};
