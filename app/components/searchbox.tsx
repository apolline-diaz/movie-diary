import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Movie {
  id: number;
  title: string;
  image_url: string;
  release_date: string;
}

export default function Searchbox({
  onResults,
}: {
  onResults: (movies: Movie[]) => void;
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMoviesByKeywordOrTitle = async () => {
      if (search.trim() === "") {
        // if search is empty, display all movies from last to first
        const { data: allMovies, error } = await supabase
          .from("movies")
          .select(
            `
            id, 
            title, 
            image_url, 
            release_date
          `
          )
          .order("created_at", { ascending: false })
          .range(0, 100);

        if (allMovies) {
          onResults(allMovies as Movie[]);
        }
      } else {
        // First, search for movies by title
        const { data: moviesByTitle, error: titleError } = await supabase
          .from("movies")
          .select(
            `
            id, 
            title, 
            image_url, 
            release_date
          `
          )
          .ilike("title", `%${search}%`); // search by title (case insensitive)

        if (moviesByTitle && moviesByTitle.length > 0) {
          onResults(moviesByTitle as Movie[]);
        } else {
          // If no movies are found by title, search by keywords
          const { data: keywords, error: keywordError } = await supabase
            .from("keywords")
            .select("id")
            .ilike("name", `%${search}%`); // search by keyword (case insensitive)

          if (keywords && keywords.length > 0) {
            const keywordIds = keywords.map((k) => k.id); // list of keyword ids

            // get movies linked to the found keywords
            const { data: movieKeywords, error: movieKeywordError } =
              await supabase
                .from("movie_keywords")
                .select("movie_id")
                .in("keyword_id", keywordIds); // search movies by keyword ids

            if (movieKeywords && movieKeywords.length > 0) {
              const movieIds = movieKeywords.map((mk) => mk.movie_id); // extract movie ids

              // get movies based on movie ids
              const { data: movies, error: movieError } = await supabase
                .from("movies")
                .select(
                  `
                  id, 
                  title, 
                  image_url, 
                  release_date
                `
                )
                .in("id", movieIds); // filter movies by ids

              if (movies) {
                onResults(movies as Movie[]);
              }
            } else {
              onResults([]); // no movie found with the keyword
            }
          } else {
            onResults([]); // no keyword found
          }
        }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchMoviesByKeywordOrTitle();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, onResults]);

  return (
    <div className="w-full">
      <form>
        <div className="w-full xs:w-1/2 flex flex-col gap-3">
          <input
            className="appearance-none text-lg font-light block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            id="title"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tapez un titre ou un mot-clé..."
          />
        </div>
      </form>
    </div>
  );
}
