"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { searchMovies } from "@/app/server-actions/movies/search-movies";
import Card from "./card";
import { getImageUrl } from "@/utils";
import Select from "./select";
import { Movie } from "../types/movie";
import MultiSelect from "./multi-select";
import { useRouter, useSearchParams } from "next/navigation";

interface FormValues {
  countryId: string;
  genreId: string;
  keywordIds: { value: string; label: string }[]; // Changed to array of keywords
  directorId: string;
  startYear: string; // Changed from releaseYear to startYear
  endYear: string;
  type: string;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const MOVIES_PER_PAGE = 50;

// component for folding sections
function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className=" overflow-hidden border-b border-rose-500">
      <button
        type="button"
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-rose-500 text-sm mb-2">{title}</span>
        {isOpen ? (
          <Icon icon="line-md:chevron-up" className="text-rose-500 size-5" />
        ) : (
          <Icon icon="line-md:chevron-down" className="size-5 text-rose-500 " />
        )}
      </button>
      {isOpen && <div className="mb-2">{children}</div>}
    </div>
  );
}
interface SearchFormProps {
  initialMovies: Movie[];
  countries: { value: string; label: string }[];
  genres: { value: string; label: string }[];
  keywords: { value: string; label: string }[];
  directors: { value: string; label: string }[];
  releaseYears: { value: string; label: string }[];
  userIsAdmin: boolean;
  urlParams?: {
    countryId: string;
    genreId: string;
    keywordIds: string[];
    directorId: string;
    startYear: string;
    endYear: string;
    type: string;
  };
}

export default function SearchForm({
  initialMovies,
  countries,
  genres,
  keywords,
  directors,
  releaseYears,
  userIsAdmin,
}: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupérer les paramètres de l'URL
  const urlCountryId = searchParams.get("countryId") || "";
  const urlGenreId = searchParams.get("genreId") || "";
  const urlDirectorId = searchParams.get("directorId") || "";
  const urlStartYear = searchParams.get("startYear") || "";
  const urlEndYear = searchParams.get("endYear") || "";
  const urlType = searchParams.get("type") || "";

  const urlKeywordIds = searchParams.get("keywordIds")
    ? searchParams
        .get("keywordIds")
        ?.split(",")
        .map((id) => {
          const keyword = keywords.find((k) => k.value === id);
          return keyword ? { value: id, label: keyword.label } : null;
        })
        .filter(Boolean) || []
    : [];

  const { control, setValue, handleSubmit, reset, watch } = useForm<FormValues>(
    {
      defaultValues: {
        countryId: urlCountryId,
        genreId: urlGenreId,
        keywordIds: urlKeywordIds as any, // Cast pour satisfaire TypeScript
        directorId: urlDirectorId,
        startYear: urlStartYear,
        endYear: urlEndYear,
        type: urlType,
      },
    }
  );

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(MOVIES_PER_PAGE);

  // Get the currently selected years to enforce validation
  const startYear = watch("startYear");
  const endYear = watch("endYear");

  // Validate year selection - ensure endYear >= startYear if both are selected
  useEffect(() => {
    if (startYear && endYear && parseInt(startYear) > parseInt(endYear)) {
      setValue("endYear", startYear);
    }
  }, [startYear, endYear, setValue]);

  // Memoize search parameters to prevent unnecessary re-renders
  // const searchParams = watch();

  // handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true); // Show loading indicator

    // Construire les paramètres de recherche pour l'URL
    const params = new URLSearchParams();
    if (data.countryId) params.set("countryId", data.countryId);
    if (data.genreId) params.set("genreId", data.genreId);
    if (data.keywordIds.length > 0) {
      const keywordIdsString = data.keywordIds.map((k) => k.value).join(",");
      params.set("keywordIds", keywordIdsString);
    }
    if (data.directorId) params.set("directorId", data.directorId);
    if (data.startYear) params.set("startYear", data.startYear);
    if (data.endYear) params.set("endYear", data.endYear);
    if (data.type) params.set("type", data.type);

    // Mettre à jour l'URL sans recharger la page
    router.replace(`/movies?${params.toString()}`);

    try {
      const results = await searchMovies({
        countryId: data.countryId,
        genreId: data.genreId,
        keywordIds: data.keywordIds.map((keyword) => keyword.value), // Convert to array of keyword IDs
        directorId: data.directorId,
        startYear: data.startYear, // Added startYear
        endYear: data.endYear,
        type: data.type,
      });

      setMovies(results); // Update the movie list with search results
      setIsLoading(false);
    } catch (error) {
      console.error("Error searching movies:", error);
      setMovies([]); // Reset the movie list on error
      setIsLoading(false);
    }
  };

  // Reset form and fetch all movies
  const handleReset = async () => {
    reset(); // Reset all form values
    setIsLoading(true);

    // Nettoyer l'URL
    router.replace("/movies");

    try {
      const results = await searchMovies({
        countryId: "",
        genreId: "",
        keywordIds: [], // Pass empty array for keywords
        directorId: "",
        startYear: "", // Reset startYear
        endYear: "",
        type: "",
      }); // Trigger search with no filters
      setMovies(results);
      setIsLoading(false);
      setVisibleCount(MOVIES_PER_PAGE); // Réinitialise l'affichage à 100 films au départ
    } catch (error) {
      console.error("Error resetting search:", error);
      setMovies([]); // Reset the movie list on error
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + MOVIES_PER_PAGE);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4 justify-between mb-5">
          <CollapsibleSection title="Période">
            <div className="grid grid-cols-2 gap-2">
              <Controller
                name="startYear"
                control={control}
                render={({ field }) => (
                  <Select
                    label="De l'année"
                    options={releaseYears}
                    {...field}
                    placeholder="Année min"
                  />
                )}
              />
              <Controller
                name="endYear"
                control={control}
                render={({ field }) => (
                  <Select
                    label="À l'année"
                    options={releaseYears}
                    {...field}
                    placeholder="Année max"
                  />
                )}
              />
            </div>
          </CollapsibleSection>
          <CollapsibleSection title="Pays">
            <Controller
              name="countryId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Pays"
                  options={countries}
                  {...field}
                  placeholder="Tous les pays"
                />
              )}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Genre">
            <Controller
              name="genreId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Genre"
                  options={genres}
                  {...field}
                  placeholder="Tous les genres"
                />
              )}
            />
          </CollapsibleSection>
          <CollapsibleSection title="Type">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  label="Type"
                  options={[
                    { value: "", label: "Tous les types" },
                    { value: "Long-métrage", label: "Long-métrage" },
                    { value: "Court-métrage", label: "Court-métrage" },
                    { value: "Emission TV", label: "Emission TV" },
                    { value: "Série", label: "Série" },
                  ]}
                  {...field}
                  placeholder="Tous les types"
                />
              )}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Réalisateur-ice">
            <Controller
              name="directorId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Réalisateur-ice"
                  options={directors}
                  {...field}
                  placeholder="Toutes les réalisateur-ices"
                />
              )}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Mots-clés">
            <Controller
              name="keywordIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  name="keywordIds"
                  control={control}
                  options={keywords}
                  label="Mots-clés"
                  placeholder="Rechercher des mots-clé"
                  onChange={field.onChange}
                />
              )}
            />
          </CollapsibleSection>
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
            className="xs:w-full sm:w-[200px] border hover:border-red-600 hover:text-red-600 text-rose-500 px-4 py-2 border-rose-500 rounded-md"
            disabled={isLoading}
          >
            Réinitialiser
          </button>
        </div>
      </form>
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
    </>
  );
}
