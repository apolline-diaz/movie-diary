"use client";

import { useState, useEffect } from "react";
import Select from "./select";
import {
  getCountries,
  getGenres,
  getKeywords,
  getReleaseYears,
  searchMovies,
} from "@/app/server-actions/movies/search-movies";

interface MovieFilterFormProps {
  onSearchResults: (movies: any[]) => void;
}

export default function SearchForm({ onSearchResults }: MovieFilterFormProps) {
  const [countries, setCountries] = useState<
    { value: string; label: string }[]
  >([]);
  const [genres, setGenres] = useState<{ value: string; label: string }[]>([]);
  const [keywords, setKeywords] = useState<{ value: string; label: string }[]>(
    []
  );
  const [releaseYears, setReleaseYears] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Fetch filter options on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoading(true);
      try {
        const [countriesData, genresData, keywordsData, yearsData] =
          await Promise.all([
            getCountries(),
            getGenres(),
            getKeywords(),
            getReleaseYears(),
          ]);

        setCountries(countriesData);
        setGenres(genresData);
        setKeywords(keywordsData);
        setReleaseYears(yearsData);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const results = await searchMovies({
        countryId: selectedCountry || undefined,
        genreId: selectedGenre || undefined,
        keywordId: selectedKeyword || undefined,
        releaseYear: selectedYear || undefined,
      });

      onSearchResults(results);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  // Reset all filters
  const handleReset = () => {
    setSelectedCountry("");
    setSelectedGenre("");
    setSelectedKeyword("");
    setSelectedYear("");

    // Trigger search with no filters
    searchMovies({}).then((results: any[]) => {
      onSearchResults(results);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Pays"
          options={countries}
          value={selectedCountry}
          onChange={setSelectedCountry}
          placeholder="Tous les pays"
        />

        <Select
          label="Genre"
          options={genres}
          value={selectedGenre}
          onChange={setSelectedGenre}
          placeholder="Tous les genres"
        />

        <Select
          label="Mot-clé"
          options={keywords}
          value={selectedKeyword}
          onChange={setSelectedKeyword}
          placeholder="Tous les mots-clés"
        />

        <Select
          label="Année de sortie"
          options={releaseYears}
          value={selectedYear}
          onChange={setSelectedYear}
          placeholder="Toutes les années"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:w-full gap-4">
        <button
          type="submit"
          className="xs:w-full sm:w-[200px] bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-md hover:from-rose-600 hover:to-red-600"
          disabled={isLoading}
        >
          Rechercher
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="xs:w-full sm:w-[200px] border hover:border-rose-500 hover:text-rose-500 text-white px-4 py-2 rounded-md "
          disabled={isLoading}
        >
          Réinitialiser
        </button>
      </div>
    </form>
  );
}
