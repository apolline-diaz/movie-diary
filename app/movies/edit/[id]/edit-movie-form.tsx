"use client";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { updateMovie } from "@/app/server-actions/movies/update-movie";
import Image from "next/image";
import { getImageUrl } from "@/utils/index";
import { Movie } from "@/app/types/movie";
import { getKeywords } from "@/app/server-actions/keywords/get-keywords";
import { getCountries } from "@/app/server-actions/countries/get-countries";
import { getGenres } from "@/app/server-actions/genres/get-genres";
import { getDirectors } from "@/app/server-actions/directors/get-directors";
import MultiSelect from "@/app/components/multi-select";

type KeywordOption = {
  value: string;
  label: string;
};

type CountryOption = {
  value: string;
  label: string;
};

type GenreOption = {
  value: string;
  label: string;
};

type DirectorOption = {
  value: string;
  label: string;
};

type FormData = {
  title: string;
  description: string | null;
  release_date: string | null;
  language: string | null;
  runtime: number | null;
  image_url: string;
  image: FileList | null;
  director_id: string;
  director: string;
  country_id: string;
  country: string;
  genre_ids: string[];
  genres: string[];
  keyword_ids: string[];
  keywords: string[];
};

export default function EditMovieForm({ movie }: { movie: Movie }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Options for select dropdowns
  const [availableKeywords, setAvailableKeywords] = useState<KeywordOption[]>(
    []
  );
  const [availableCountries, setAvailableCountries] = useState<CountryOption[]>(
    []
  );
  const [availableGenres, setAvailableGenres] = useState<GenreOption[]>([]);
  const [availableDirectors, setAvailableDirectors] = useState<
    DirectorOption[]
  >([]);

  // Filtered and selected states

  const [selectedKeywords, setSelectedKeywords] = useState<KeywordOption[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<GenreOption[]>([]);

  // Image preview
  const [imagePreview, setImagePreview] = useState<string | null>(
    movie.image_url || null
  );

  // Prepare initial form values from movie data
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: movie.title,
      description: movie.description || "",
      release_date: movie.release_date || "",
      language: movie.language || "",
      runtime: movie.runtime || null,
      image_url: movie.image_url || "",
      image: null,
      director_id:
        movie.directors && movie.directors[0]
          ? movie.directors[0].id.toString()
          : "",
      country_id:
        movie.countries && movie.countries[0]
          ? movie.countries[0].id.toString()
          : "",
      genres: [],
      keywords: [],
    },
  });

  // Watch for image changes to update preview
  const imageFile = watch("image");

  // Fetch all reference data on component mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      // Fetch keywords
      const keywords = await getKeywords();
      setAvailableKeywords(
        keywords.map((k) => ({
          value: k.value.toString(),
          label: k.label || "",
        }))
      );

      // Fetch countries
      const countries = await getCountries();
      setAvailableCountries(
        countries.map((c) => ({
          value: c.id.toString(),
          label: c.name,
        }))
      );

      // Fetch genres
      const genres = await getGenres();
      setAvailableGenres(
        genres.map((g) => ({
          value: g.id.toString(),
          label: g.name || "",
        }))
      );

      // Fetch directors
      const directors = await getDirectors();
      setAvailableDirectors(
        directors.map((d) => ({
          value: d.id.toString(),
          label: d.name || "",
        }))
      );

      // Set initially selected genres
      if (movie.genres && movie.genres.length > 0) {
        const movieGenres = movie.genres
          .filter((genre) => genre.name)
          .map((genre) => ({
            value: genre.id.toString(),
            label: genre.name || "",
          }));
        setSelectedGenres(movieGenres);
        setValue(
          "genres",
          movieGenres.map((g) => g.value)
        );
      }

      // Set initially selected keywords
      if (movie.keywords && movie.keywords.length > 0) {
        const movieKeywords = movie.keywords
          .filter((keyword) => keyword.name)
          .map((keyword) => ({
            value: keyword.id.toString(),
            label: keyword.name || "",
          }));
        setSelectedKeywords(movieKeywords);
        setValue(
          "keywords",
          movieKeywords.map((k) => k.value)
        );
      }

      // Set selected country
      if (movie.countries && movie.countries.length > 0) {
        setValue("country_id", movie.countries[0].id.toString());
      }

      // Set selected director
      if (movie.directors && movie.directors.length > 0) {
        setValue("director_id", movie.directors[0].id.toString());
      }
    };

    fetchReferenceData();
  }, [movie, setValue]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);

      // Clean up the object URL when the component unmounts or the file changes
      return () => URL.revokeObjectURL(fileUrl);
    }
  }, [imageFile]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get keyword IDs from selected keywords
      const keywordIds = data.keywords;

      // Get genre IDs from selected genres
      const genreIds = data.genres;

      // Get selected director and country names
      const selectedDirector = availableDirectors.find(
        (d) => d.value === data.director_id
      );
      const selectedCountry = availableCountries.find(
        (c) => c.value === data.country_id
      );

      // Get names of all selected genres
      const selectedGenreNames = selectedGenres.map((g) => g.label);

      // Get names of all selected keywords
      const selectedKeywordNames = selectedKeywords.map((k) => k.label);

      // Prepare movie data for update
      const movieData = {
        id: movie.id,
        title: data.title,
        description: data.description ?? null,
        release_date: data.release_date ?? null,
        language: data.language ?? null,
        runtime: data.runtime ?? null,
        image_url: data.image_url ?? null,
        image: data.image && data.image.length > 0 ? data.image[0] : null,
        director_id: data.director_id,
        director: selectedDirector?.label || "",
        country_id: data.country_id,
        country: selectedCountry?.label || "",
        genre_ids: genreIds,
        genres: selectedGenreNames,
        keyword_ids: keywordIds,
        keywords: selectedKeywordNames,
      };

      const { success, error } = await updateMovie(movieData);

      if (success) {
        // Navigate back to movie page
        router.push(`/movies/${movie.id}`);
        router.refresh();
      } else {
        setError(error || "Something went wrong");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg shadow-lg justify-start text-white mx-auto"
    >
      {error && (
        <div className="mb-4 p-4 bg-red-500 text-white rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 xs:grid-col md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full py-2 text-sm font-light border-b bg-transparent"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Director Select */}
        <div>
          <label htmlFor="director_id" className="block text-sm font-medium">
            Réalisateur-ice
          </label>
          <select
            id="director_id"
            {...register("director_id")}
            className="mt-1 block w-full text-sm font-light bg-transparent border-b border-gray-300 py-2"
          >
            <option value="">Select a director</option>
            {availableDirectors.map((director) => (
              <option key={director.value} value={director.value}>
                {director.label}
              </option>
            ))}
          </select>
        </div>

        {/* Image Preview */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-3">
            Image actuelle
          </label>
          <div className="relative h-64 bg-gray-700 rounded-md overflow-hidden">
            {imagePreview ? (
              <Image
                src={getImageUrl(imagePreview)}
                alt={movie.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-md"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Pas d&apos;image disponible
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">
            Télécharger une nouvelle image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full py-2 hover:cursor-pointer focus:outline-none"
          />
          <p className="text-gray-400 text-xs mt-1">
            Laisser vide pour garder l&apos;image actuelle
          </p>
        </div>

        {/* Image URL */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            {...register("image_url")}
            className="w-full py-2 text-sm font-light border-b bg-transparent"
          />
          <p className="text-gray-400 text-xs mt-1">
            Will be used if no image is uploaded
          </p>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-3 py-2 font-light text-sm border rounded-md bg-transparent"
          />
        </div>

        {/* Release Date */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Année de sortie
          </label>
          <input
            {...register("release_date")}
            className="w-full text-sm font-light py-2 border-b bg-transparent"
          />
        </div>

        {/* Country Select */}
        <div>
          <label htmlFor="country_id" className="block text-sm font-medium">
            Pays de production
          </label>
          <select
            id="country_id"
            {...register("country_id")}
            className="mt-1 block w-full text-sm font-light bg-transparent border-b border-gray-300 py-2"
          >
            <option value="">Select a country</option>
            {availableCountries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>

        {/* Runtime */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Durée (minutes)
          </label>
          <input
            type="number"
            {...register("runtime", {
              pattern: {
                value: /^\d*\.?\d*$/,
                message: "Must be a number",
              },
            })}
            className="w-full text-sm font-light py-2 border-b bg-transparent"
          />
          {errors.runtime && (
            <p className="text-red-500 text-sm mt-1">
              {errors.runtime.message}
            </p>
          )}
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium mb-1">Langue</label>
          <input
            {...register("language")}
            className="w-full text-sm font-light py-2 border-b bg-transparent"
          />
        </div>

        {/* Genres Select */}
        <MultiSelect
          name="genres"
          control={control}
          options={availableGenres}
          label="Genres"
          placeholder="Chercher et ajouter des genres..."
          onChange={(selected) => {
            setSelectedGenres(selected);
            setValue(
              "genres",
              selected.map((g) => g.value)
            );
          }}
          defaultValues={selectedGenres}
        />
        <p className="text-gray-400 text-xs mt-1">
          Vous pouvez sélectionner plusieurs genres et en retirer.
        </p>

        {/* Keywords - Multi-Select */}
        <MultiSelect
          name="keywords"
          control={control}
          options={availableKeywords}
          label="Mots-clé"
          placeholder="Chercher et ajouter des mot-clés..."
          onChange={(selected) => {
            setSelectedKeywords(selected);
            setValue(
              "keywords",
              selected.map((k) => k.value)
            );
          }}
          defaultValues={selectedKeywords}
        />
        <p className="text-gray-400 text-xs mt-1">
          Vous pouvez sélectionner plusieurs mot-clés et en retirer.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 xs:flex-col sm:flex-row justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-none border rounded-md hover:border-rose-500 hover:text-rose-500 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 rounded-md hover:from-rose-600 hover:to-red-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Mise à jour..." : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}
