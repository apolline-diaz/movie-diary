"use client";

import { useState, useEffect } from "react";
import Card from "@/app/components/card";
import SearchForm from "@/app/components/search-form";
import { getImageUrl } from "@/utils";
import { searchMovies } from "@/app/server-actions/movies/search-movies";
import Searchfield from "../components/searchfield";

interface Movie {
  id: string;
  title: string;
  image_url: string;
  release_date: string;
}

export default function Catalogue() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // load all movies on initial page load
  useEffect(() => {
    const loadInitialMovies = async () => {
      setIsLoading(true);
      try {
        const initialMovies = await searchMovies({});
        setMovies(initialMovies);
      } catch (error) {
        console.error("Error loading initial movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialMovies();
  }, []);

  // Fonction pour gérer les résultats de la barre de recherche
  const handleSearchResults = (newMovies: Movie[]) => {
    setMovies(newMovies);
  };

  // Fonction pour gérer les résultats de la recherche avancée
  const handleAdvancedSearchResults = (newMovies: Movie[]) => {
    setMovies(newMovies);
  };

  //TO DO : avoid the invalidation of the movies results of the search form by the searchfield

  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  return (
    <div className="h-full w-full justify-center items-center text-white">
      <div className="px-10 pt-10">
        <h1 className="text-2xl text-rose-500 font-medium mb-5">Recherche</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex flex-col gap-5 w-full">
            <Searchfield onResults={handleSearchResults} />

            <button
              onClick={toggleAdvancedSearch}
              className="sm:w-[300px] xs:w-full bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-md hover:from-rose-600 hover:to-red-600"
            >
              {showAdvancedSearch
                ? "Sortir de la recherche avancée"
                : "Lancer une recherche avancée"}{" "}
            </button>
          </div>
        </div>

        {showAdvancedSearch && (
          <div className="mt-4 p-4 border rounded-lg">
            <SearchForm onSearchResults={handleAdvancedSearchResults} />
          </div>
        )}
      </div>

      <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-10">
        {isLoading ? (
          <p className="">Chargement ...</p>
        ) : movies.length === 0 ? (
          <p className="">Aucun film trouvé</p>
        ) : (
          movies.map((movie) => (
            <Card
              directors={null}
              key={`${movie.title}-${movie.id}`}
              {...movie}
              image_url={getImageUrl(movie.image_url)}
              description={""}
            />
          ))
        )}
      </div>
    </div>
  );
}
