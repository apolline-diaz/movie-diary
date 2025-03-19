import {
  searchMovies,
  getCountries,
  getGenres,
  getKeywords,
  getReleaseYears,
} from "@/app/server-actions/movies/search-movies";
import ClientSearchComponent from "./client";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Get keyword from URL parameters if it exists
  const keywordParam = (searchParams?.keyword as string) || "";

  // get filter data and all movies (initial movies)
  const initialMovies = await searchMovies({});
  const countries = await getCountries();
  const genres = await getGenres();
  const keywords = await getKeywords();
  const releaseYears = await getReleaseYears();

  return (
    <div className="h-full w-full justify-center items-center text-white">
      <div className="px-10 pt-10">
        <h1 className="text-2xl text-rose-500 font-medium mb-5">Catalogue</h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex flex-col gap-5 w-full">
            <ClientSearchComponent
              initialMovies={initialMovies}
              countries={countries}
              genres={genres}
              keywords={keywords}
              releaseYears={releaseYears}
              initialKeyword={keywordParam}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
