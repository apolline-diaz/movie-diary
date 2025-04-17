"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { updateList } from "@/app/server-actions/lists/update-list";
import { getList } from "@/app/server-actions/lists/get-list";
import { getMovies } from "@/app/server-actions/movies/get-movies";
import MoviesMultiSelect from "@/app/components/movies-multi-select";
import { SubmitButton } from "@/app/components/submit-button";

export default function EditListPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [movies, setMovies] = useState<{ value: string; label: string }[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      movie_id: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await getList(id);
        const moviesData = await getMovies({
          title: "",
          keyword: "",
          director: "",
          country: "",
          genre: "",
          year: "",
        });

        setValue("title", list.title);
        setValue("description", list.description || "");
        setSelectedMovies(
          list.lists_movies.map((item: any) => ({
            value: item.movies.id,
            label: item.movies.title,
          }))
        );
        setMovies(
          moviesData.map((movie: any) => ({
            value: movie.id,
            label: movie.title,
          }))
        );

        setIsLoading(false);
      } catch (error) {
        console.error("Impossible de récupérer les données:", error);
        router.push(`/lists/${id}`);
      }
    };

    fetchData();
  }, [id, router, setValue]);

  const onMovieChange = (selected: { value: string; label: string }[]) => {
    setSelectedMovies(selected);
    setValue("movie_id", selected.map((s) => s.value).join(","));
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("movie_id", data.movie_id || "");

      const result = await updateList(id, formData);

      if (result.type === "success") {
        router.push(`/lists/${id}`);
      } else {
        setError(result.message || "Une erreur s'est produite");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      setError("Une erreur inattendue s'est produite");
    }
  };

  return (
    <div className="px-10 py-20">
      <h1 className="text-2xl text-rose-500 mb-5">Modifier la liste</h1>
      {isLoading ? (
        <div className="space-y-4 w-full sm:w-1/2">
          <div className={"animate-pulse bg-neutral-300 rounded h-10 w-full"} />
          <div className={"animate-pulse bg-neutral-300 rounded h-20 w-full"} />
          <div className={"animate-pulse bg-neutral-300 rounded h-10 w-full"} />
          <div className={"animate-pulse bg-neutral-300 rounded h-10 w-32"} />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-rose-500 py-5 w-full sm:w-1/2"
        >
          <input type="hidden" {...register("movie_id")} />

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Titre</label>
            <input
              className="w-full border-b text-sm placeholder-gray-500 text-black font-light py-2 bg-transparent border-rose-500"
              {...register("title")}
              placeholder="Mon top 2025"
            />
            {errors.title && (
              <span className="text-red-500 text-xs">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              className="w-full rounded-md text-sm text-black placeholder-gray-500 font-light border py-3 px-4  bg-white border-rose-500"
              {...register("description")}
              placeholder="Entrez une description..."
            />
          </div>

          <div className="mb-6">
            <MoviesMultiSelect
              name="movie_id"
              options={movies}
              defaultValues={selectedMovies}
              onChange={onMovieChange}
              label="Sélection de films"
              placeholder="Chercher des films..."
              control={control}
            />
          </div>

          <SubmitButton
            defaultText="Enregistrer les modifications"
            loadingText="Chargement..."
            isSubmitting={isSubmitting}
          />
        </form>
      )}
    </div>
  );
}
