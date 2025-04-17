"use client";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { updateMovie } from "@/app/server-actions/movies/update-movie";
import { Image } from "@/app/components/image";
import { getImageUrl } from "@/utils/index";
import { Movie } from "@/app/types/movie";
import { getKeywords } from "@/app/server-actions/keywords/get-keywords";
import { getCountries } from "@/app/server-actions/countries/get-countries";
import { getGenres } from "@/app/server-actions/genres/get-genres";
import { getDirectors } from "@/app/server-actions/directors/get-directors";
import MultiSelect from "@/app/components/multi-select";
import { SubmitButton } from "@/app/components/submit-button";
import { uploadImage } from "@/utils/upload-image";

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
  type: string | null;
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
      type: movie.type || "",
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
  const imageUrl = watch("image_url");

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
    } else if (imageUrl) {
      // Use the image URL if no file is uploaded
      setImagePreview(imageUrl);
    }
  }, [imageFile, imageUrl]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Garde l'ancienne image si aucune nouvelle image n'est uploadée
      let imageUrl = data.image_url;

      if (imageFile && imageFile instanceof File) {
        // Si une nouvelle image a été choisie, on l'upload
        imageUrl = await uploadImage(imageFile, data.title); // Upload l'image et récupère l'URL
      }

      // Préparer le FormData pour l'envoi à l'API
      const formDataToUpdate = new FormData();
      formDataToUpdate.append("id", movie.id);
      formDataToUpdate.append("title", data.title);
      formDataToUpdate.append("description", data.description ?? "");
      formDataToUpdate.append("release_date", data.release_date ?? "");
      formDataToUpdate.append("language", data.language ?? "");
      formDataToUpdate.append("type", data.type ?? "");
      formDataToUpdate.append("runtime", data.runtime?.toString() ?? "");
      formDataToUpdate.append("image_url", imageUrl); // Utilise l'URL d'image après upload

      // Ajouter l'image si elle existe
      if (data.image && data.image.length > 0) {
        // data.image[0] correspond au premier fichier dans FileList
        formDataToUpdate.append("image", data.image[0]);
      }

      formDataToUpdate.append("director_id", data.director_id);
      formDataToUpdate.append("country_id", data.country_id);
      formDataToUpdate.append("genre_ids", JSON.stringify(data.genres));
      formDataToUpdate.append("keyword_ids", JSON.stringify(data.keywords));

      console.log("Sending FormData:", formDataToUpdate);

      // Appeler la fonction pour mettre à jour le film
      const { success, error } = await updateMovie(formDataToUpdate);
      console.log("Response from updateMovie:", success, error);

      if (success) {
        // Naviguer vers la page du film après la mise à jour
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
      className="rounded-lg text-rose-500 justify-start mx-auto"
    >
      {error && (
        <div className="mb-4 p-4 bg-red-500 text-white rounded-md">{error}</div>
      )}

      <div className="flex flex-col gap-6">
        {/* Title */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full py-2 text-sm font-light border-b border-rose-500 bg-transparent"
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
            className="mt-1 block w-full text-sm font-light bg-transparent border-b border-rose-500  py-2"
          >
            <option value="">Select a director</option>
            {availableDirectors.map((director) => (
              <option
                key={director.value}
                value={director.value}
                // Mark as selected if it matches the current director
                selected={
                  movie.directors &&
                  movie.directors[0]?.id.toString() === director.value
                }
              >
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
          <div className="relative rounded-xl h-64 bg-gray-700 overflow-hidden">
            {imagePreview ? (
              <Image
                src={getImageUrl(imagePreview)}
                alt={movie.title}
                style={{ objectFit: "cover" }}
                className="rounded-md  w-full h-full"
                title={movie.title}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Pas d&apos;image disponible
              </div>
            )}
          </div>
        </div>

        {/* Image URL */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            {...register("image_url")}
            className="w-full py-2 text-sm font-light border-b bg-transparent"
          />
          <p className="text-gray-600 text-xs mt-1">
            Sera utilisée si aucune image n&apos;est téléchargée
          </p>
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
          <p className="text-gray-600 text-xs mt-1">
            Laisser vide pour garder l&apos;image actuelle ou utiliser
            l&apos;URL ci-dessus
          </p>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-3 py-2 font-light text-sm border border-rose-500 rounded-md bg-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Release Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Année de sortie
            </label>
            <input
              {...register("release_date")}
              className="w-full text-sm font-light py-2 border-b border-rose-500 bg-transparent"
            />
          </div>

          {/* Country Select */}
          <div>
            <label htmlFor="country_id" className="block text-sm font-medium">
              Pays
            </label>
            <select
              id="country_id"
              {...register("country_id")}
              className="w-full mt-1 block text-sm font-light bg-transparent border-b border-rose-500  py-2"
            >
              <option value="">Select a country</option>
              {availableCountries.map((country) => (
                <option
                  key={country.value}
                  value={country.value}
                  // Mark as selected if it matches the current country
                  selected={
                    movie.countries &&
                    movie.countries[0]?.id.toString() === country.value
                  }
                >
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
              className="w-full text-sm font-light border-rose-500  py-2 border-b bg-transparent"
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
              className="w-full text-sm border-rose-500 font-light py-2 border-b bg-transparent"
            />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <input
            {...register("type")}
            className="w-full text-sm font-light border-rose-500 py-2 border-b bg-transparent"
          />
        </div>

        {/* Genres Select */}
        <div>
          <label className="text-rose-500 block text-sm font-medium mb-1">
            Genres
          </label>
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
          <p className="text-gray-600 text-xs mt-1">
            Vous pouvez sélectionner plusieurs genres et en retirer.
          </p>
        </div>
        {/* Keywords - Multi-Select */}
        <div>
          <label className="text-rose-500 block text-sm font-medium mb-1">
            Mots-clés
          </label>

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
          <p className="text-gray-600 text-xs mt-1">
            Vous pouvez sélectionner plusieurs mot-clés et en retirer.
          </p>
        </div>
      </div>

      <div className="mt-8 font-light flex flex-col gap-3 xs:flex-col sm:flex-row justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="xs:w-full sm:w-[200px] border hover:border-red-500 hover:text-red-500 text-rose-500 px-4 py-2 border-rose-500 rounded-md"
        >
          Annuler
        </button>
        <SubmitButton
          defaultText="Enregistrer les modifications"
          loadingText="Chargement..."
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
}
