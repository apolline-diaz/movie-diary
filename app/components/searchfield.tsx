import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { getMoviesByWord } from "@/app/server-actions/movies/get-movies-by-word";

import Card from "./card";
import { getImageUrl } from "@/utils";
import { Movie } from "../types/movie";

type FormValues = {
  search: string;
};

const MOVIES_PER_PAGE = 50;

export default function Searchfield({
  initialMovies,
  initialSearch = "",
  userIsAdmin,
}: {
  initialMovies: Movie[];

  initialSearch?: string;

  initialKeyword?: string;
  userIsAdmin: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupérer les valeurs depuis l'URL
  const urlSearch = searchParams.get("search") || initialSearch;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { search: urlSearch },
  });

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(MOVIES_PER_PAGE);

  // Fonction pour effectuer la recherche
  const performSearch = async (searchTerm: string) => {
    try {
      setIsLoading(true);
      setVisibleCount(MOVIES_PER_PAGE);

      if (searchTerm) {
        const results = await getMoviesByWord(searchTerm);
        setMovies(results);
      } else {
        const results = await getMoviesByWord("");
        setMovies(results);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de la soumission du formulaire de recherche simple
  const onSubmit = (data: FormValues) => {
    const params = new URLSearchParams(searchParams.toString());

    // Mettre à jour les paramètres
    if (data.search) {
      params.set("search", data.search);
    } else {
      params.delete("search");
    }

    // Toujours définir le mode de recherche sur "field" pour la recherche simple
    params.set("searchMode", "field");

    // Navigation avec les nouveaux paramètres
    router.push(`/movies?${params.toString()}`);
  };

  useEffect(() => {
    const term = searchParams.get("search") || "";
    performSearch(term);
  }, [searchParams]);

  // Fonction pour réinitialiser la recherche
  const handleReset = () => {
    reset({ search: "" });

    const params = new URLSearchParams();
    params.set("searchMode", "field");
    router.push(`/movies?${params.toString()}`);

    // Réinitialiser les résultats
    performSearch("");
  };

  // Fonction pour charger plus de résultats
  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + MOVIES_PER_PAGE);
  };

  return (
    <div className="w-full my-4">
      <div className=" mb-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-sm w-full xs:w-1/2 my-2 flex flex-col sm:flex-row gap-3">
            <div className="w-full">
              <Controller
                name="search"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="appearance-none text-md placeholder-gray-500 font-light block w-full bg-white rounded-md border  border-rose-500 text-rose-500 p-2 leading-tight focus:none focus:outline-none"
                    placeholder="Entrez un mot ou un titre..."
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:w-full gap-4 py-2">
            <button
              type="submit"
              className="xs:w-full sm:w-[200px] bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-md hover:from-rose-600 hover:to-red-600"
            >
              Rechercher
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="xs:w-full sm:w-[200px] border hover:border-red-600 hover:text-red-600 text-rose-500 px-4 py-2 border-rose-500 rounded-md"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
      <div className="text-rose-500 border-b border-rose-500 text-md font-light mb-5">
        {isLoading ? (
          <div className="animate-pulse rounded-xl h-6 bg-gray-400 w-3/4 mb-2"></div>
        ) : (
          `${movies.length} films trouvés`
        )}
      </div>
      <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl bg-gray-300 h-48 w-full justify-end max-w-xs mx-auto group overflow-hidden flex flex-col transition-transform"
            >
              <div className="flex flex-col p-5 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              </div>
            </div>
          ))
        ) : movies.length === 0 ? (
          <p>Aucun film trouvé</p>
        ) : (
          movies
            .slice(0, visibleCount)
            .map((movie) => (
              <Card
                key={`${movie.title}-${movie.id}`}
                {...movie}
                userIsAdmin={userIsAdmin}
                image_url={getImageUrl(movie.image_url || "")}
              />
            ))
        )}
      </div>
      {visibleCount < movies.length && !isLoading && (
        <button
          onClick={loadMore}
          className="w-full flex flex-row justify-center items-center border rounded-md border-rose-500 border-t mt-4 px-4 py-2 hover:border-red-500 text-rose-500 hover:text-red-500"
        >
          Voir plus <Icon icon="mdi:chevron-down" className="size-5" />
        </button>
      )}
    </div>
  );
}
