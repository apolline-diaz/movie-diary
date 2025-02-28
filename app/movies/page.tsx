"use client";

import { Suspense } from "react";
import Card from "@/app/components/card";
import Searchform from "@/app/components/searchform";
import { getImageUrl } from "@/utils";
import { searchMoviesByTitle } from "@/app/server-actions/movies/search-movies-by-title";
import { searchMoviesByKeyword } from "@/app/server-actions/keywords/search-movies-by-keyword";

interface SearchParams {
  title?: string;
  keyword?: string;
}

async function MoviesGrid({ searchParams }: { searchParams: SearchParams }) {
  let movies: any[] = [];

  try {
    console.log("Appel de MoviesGrid avec searchParams :", searchParams);

    if (searchParams.title) {
      const result = await searchMoviesByTitle(searchParams.title);
      movies = result || [];
    } else if (searchParams.keyword) {
      const result = await searchMoviesByKeyword(searchParams.keyword);
      movies = result || [];
    } else {
      const result = await searchMoviesByTitle(""); // Get recent movies
      movies = result || [];
    }
    console.log("Films récupérés dans MoviesGrid :", movies.length);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }

  if (movies.length === 0) {
    return <p className="p-10">Aucun résultat trouvé</p>;
  }

  return (
    <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-10">
      {movies.map((movie) => (
        <Card
          directors={null}
          key={`${movie.title}-${movie.id}`}
          {...movie}
          image_url={getImageUrl(movie.imageUrl)}
          description={""}
          releaseDate={movie.releaseDate}
        />
      ))}
    </div>
  );
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="h-full w-full justify-center items-center text-white">
      <div className="px-10">
        <div className="tracking-wide text-xl pt-10 py-5 text-rose-500">
          Recherche
        </div>
        <Searchform />
      </div>

      <Suspense
        fallback={
          <div className="w-full p-10">
            <p className="">Chargement ...</p>
          </div>
        }
      >
        <MoviesGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
