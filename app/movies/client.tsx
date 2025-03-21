"use client";

import React, { useState } from "react";
import SearchForm from "@/app/components/search-form";
import Searchfield from "@/app/components/searchfield";
import { Movie } from "../types/movie";

interface ClientSearchComponentProps {
  initialMovies: Movie[];
  countries: { value: string; label: string }[];
  genres: { value: string; label: string }[];
  keywords: { value: string; label: string }[];
  releaseYears: { value: string; label: string }[];
  initialKeyword?: string;
}

export default function ClientSearchComponent({
  initialMovies,
  countries,
  genres,
  keywords,
  releaseYears,
  initialKeyword = "",
}: ClientSearchComponentProps) {
  const [searchMode, setSearchMode] = useState<"field" | "form">(
    initialKeyword ? "field" : "form"
  );

  const toggleSearchMode = () => {
    setSearchMode(searchMode === "field" ? "form" : "field");
  };

  return (
    <div>
      <button
        onClick={toggleSearchMode}
        className="xs:w-full w-auto my-2 font-light hover:bg-rose-500 hover:text-white bg-transparent text-rose-500 border p-2 border-rose-500 rounded-md"
      >
        {searchMode === "field"
          ? "Faire une recherche avancée?"
          : "Rechercher par titre ou mot-clé? "}
      </button>

      {searchMode === "field" ? (
        <Searchfield
          initialMovies={initialMovies}
          initialKeyword={initialKeyword}
        />
      ) : (
        <SearchForm
          initialMovies={initialMovies}
          countries={countries}
          genres={genres}
          keywords={keywords}
          releaseYears={releaseYears}
        />
      )}
    </div>
  );
}
