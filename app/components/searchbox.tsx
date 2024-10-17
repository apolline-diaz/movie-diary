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
    const fetchMoviesByKeyword = async () => {
      if (search.trim() === "") {
        // if search if empty, display all movies from last to first
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
        // get if of the keyword corresponding to search
        const { data: keywords, error: keywordError } = await supabase
          .from("keywords")
          .select("id")
          .ilike("name", `%${search}%`); // search insensitive to breakage

        if (keywords && keywords.length > 0) {
          const keywordIds = keywords.map((k) => k.id); // list of keywords id corresponding

          // get movies link to keywords found
          const { data: movieKeywords, error: movieKeywordError } =
            await supabase
              .from("movie_keywords")
              .select("movie_id")
              .in("keyword_id", keywordIds); // search movies with keywords

          if (movieKeywords && movieKeywords.length > 0) {
            const movieIds = movieKeywords.map((mk) => mk.movie_id); // export id from movies

            // get movies based on movies id
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
              .in("id", movieIds); // filter movies by id

            if (movies) {
              onResults(movies as Movie[]);
            }
          } else {
            onResults([]); // no movie found with keyword
          }
        } else {
          onResults([]); // no keyword found
        }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchMoviesByKeyword();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, onResults]);

  return (
    <div className="w-full">
      <form>
        <div className="w-full xs:w-1/2 flex flex-col gap-3 mb-5">
          <input
            className="appearance-none text-lg font-light block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            id="title"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cherchez un mot-clé..."
          />
        </div>
      </form>
    </div>
  );
}
