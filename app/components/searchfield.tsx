import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import {
  getMoviesByKeyword,
  getMoviesByTitle,
} from "@/app/server-actions/movies/get-movies-by-title-and-keyword";
import Card from "./card";
import { getImageUrl } from "@/utils";
import { Movie } from "../types/movie";

interface FormValues {
  title: string;
  keyword: string;
}

export default function Searchfield({
  initialMovies,
  initialKeyword = "",
}: {
  initialMovies: Movie[];
  initialKeyword?: string;
}) {
  const { control, watch, setValue } = useForm<FormValues>({
    defaultValues: { title: "", keyword: initialKeyword },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isLoading, setIsLoading] = useState(false);

  const titleSearch = watch("title");
  const keywordSearch = watch("keyword");

  useEffect(() => {
    const updateURL = (title: string, keyword: string) => {
      const params = new URLSearchParams(searchParams);
      title ? params.set("title", title) : params.delete("title");
      keyword ? params.set("keyword", keyword) : params.delete("keyword");
      router.push(`/movies?${params.toString()}`, { scroll: false });
    };

    const delayDebounceFn = setTimeout(() => {
      updateURL(titleSearch, keywordSearch);
    });

    return () => clearTimeout(delayDebounceFn);
  }, [titleSearch, keywordSearch, router, searchParams]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      if (titleSearch) {
        setMovies(await getMoviesByTitle(titleSearch));
      } else if (keywordSearch) {
        setMovies(await getMoviesByKeyword(keywordSearch));
      } else {
        setMovies(initialMovies);
      }
      setIsLoading(false);
    };

    const delayDebounceFn = setTimeout(fetchMovies, 0);
    return () => clearTimeout(delayDebounceFn);
  }, [titleSearch, keywordSearch, initialMovies]);

  const handleReset = () => {
    setValue("title", "");
    setValue("keyword", "");
    setMovies(initialMovies);
    router.push("/movies", { scroll: false });
  };

  return (
    <div className="w-full  my-4">
      <div className="px-4 py-2 border rounded-lg mb-4">
        <form>
          <div className="text-sm w-full xs:w-1/2 my-2 flex flex-col sm:flex-row gap-3">
            <div className="w-full">
              Titre
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="appearance-none text-md font-light block w-full bg-neutral-950 border-b border-b-white text-gray-200 py-2 leading-tight focus:none focus:outline-none"
                    placeholder="Entrez un titre de film"
                  />
                )}
              />
            </div>
            <div className="w-full">
              Mot-clé
              <Controller
                name="keyword"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="appearance-none text-md font-light block w-full bg-neutral-950 border-b border-b-white text-gray-200 py-2 leading-tight focus:none focus:outline-none"
                    placeholder="Entrez un mot-clé"
                  />
                )}
              />
            </div>
          </div>
        </form>
        <button
          type="button"
          onClick={handleReset}
          className="my-2 xs:w-full w-full sm:w-[200px] border hover:border-rose-500 hover:text-rose-500 text-white px-4 py-2 rounded-md"
        >
          Réinitialiser
        </button>
      </div>
      <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-500 h-48 w-full justify-end max-w-xs mx-auto group overflow-hidden flex flex-col transition-transform"
            >
              <div className="flex flex-col p-5 space-y-2">
                <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-400 rounded w-1/3 mb-2"></div>
              </div>
            </div>
          ))
        ) : movies.length === 0 ? (
          <p>Aucun film trouvé</p>
        ) : (
          movies.map((movie) => (
            <Card
              key={`${movie.title}-${movie.id}`}
              {...movie}
              image_url={getImageUrl(movie.image_url || "")}
            />
          ))
        )}
      </div>
    </div>
  );
}
