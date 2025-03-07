import React, { useState, useEffect } from "react";
import { getMoviesByKeyword, getMoviesByTitle } from "@/utils/movies-search";

interface Movie {
  id: string;
  title: string;
  image_url: string;
  release_date: string;
}

export default function Searchfield({
  onResults,
}: {
  onResults: (movies: Movie[]) => void;
}) {
  const [titleSearch, setTitleSearch] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (titleSearch.trim()) {
        const results = await getMoviesByTitle(titleSearch);
        onResults(results); // Recherche par titre
      } else if (keywordSearch.trim()) {
        const results = await getMoviesByKeyword(keywordSearch);
        onResults(results); // Recherche par mot-clé
      } else {
        // Si aucun des champs n'est rempli, on retourne tous les films
        const results = await getMoviesByTitle(""); // Récupérer tous les films
        onResults(results);
      }
    }, 500); // Délai de 500ms après la dernière modification

    return () => clearTimeout(delayDebounceFn); // Nettoyage de la fonction lors du démontage
  }, [titleSearch, keywordSearch, onResults]);

  return (
    <div className="w-full ">
      <form>
        <div className="w-full xs:w-1/2 flex flex-col sm:flex-row gap-3">
          <input
            className="appearance-none text-md font-light block w-full bg-neutral-950 border-b border-b-white text-gray-200 py-3 leading-tight focus:outline-none "
            id="title"
            type="text"
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            placeholder="Entrez un titre"
          />
          <input
            className="appearance-none text-md font-light block w-full bg-neutral-950 border-b border-b-white text-gray-200 py-3 leading-tight focus:outline-none "
            id="keyword"
            type="text"
            value={keywordSearch}
            onChange={(e) => setKeywordSearch(e.target.value)}
            placeholder="Entrez un mot-clé"
          />
        </div>
      </form>
    </div>
  );
}
