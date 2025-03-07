"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { createList } from "@/app/server-actions/lists";
import { SubmitButton } from "@/app/components/submit-button";
import { getMovies } from "@/app/server-actions/movies/get-movies";

// Updated Types to match your actual data
interface Movie {
  id: string;
  title: string;
  release_date: string;
  genres: { name: string }[];
  countries: { name: string }[];
  keywords: { name: string }[];
}

interface FormState {
  type: string;
  message: string;
  errors: {
    title?: string[];
    description?: string[];
    movie_id?: string[];
    image_url?: string[];
  } | null;
}

const initialState: FormState = {
  type: "",
  message: "",
  errors: null,
};

const CreateListPage: React.FC = () => {
  const [state, formAction] = useFormState<FormState, FormData>(
    createList,
    initialState
  );
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [movieInput, setMovieInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesData = await getMovies({
          title: "",
          keyword: "",
          director: "",
          country: "",
          genre: "",
          year: "",
        });
        // Now this should work as the types match
        setMovies(moviesData);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchData();
  }, []);

  const handleMovieInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovieInput(e.target.value);
    setIsSearching(e.target.value.length > 0);
  };

  const handleAddMovie = (movie: Movie) => {
    if (!selectedMovies.find((m) => m.id === movie.id)) {
      setSelectedMovies((prev) => [...prev, movie]);
    }
    setMovieInput("");
    setIsSearching(false);
  };

  const handleRemoveMovie = (id: string) => {
    setSelectedMovies((prev) => prev.filter((m) => m.id !== id));
  };

  const filteredMovies = movies
    .filter(
      (movie) =>
        movie.title.toLowerCase().includes(movieInput.toLowerCase()) &&
        !selectedMovies.find((m) => m.id === movie.id)
    )
    .slice(0, 5);

  return (
    <div className="p-10">
      <div className="tracking-wide text-xl text-rose-500 mb-5">
        Créer une liste de films
      </div>

      {state?.type === "error" && (
        <p className="text-red-500 text-xs italic">{state.message}</p>
      )}

      <form action={formAction} className="py-5">
        {/* Title of the list */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <label className="block tracking-wide text-sm mb-2" htmlFor="title">
            Titre de la liste
          </label>
          <input
            className="appearance-none block w-full text-sm font-light bg-neutral-950 border-b py-3 mb-3 leading-tight focus:outline-none"
            id="title"
            type="text"
            name="title"
            placeholder="Mon top 2025"
          />
          {state?.errors?.title && (
            <span className="text-red-500 text-xs italic">
              {state.errors.title.join(",")}
            </span>
          )}
        </div>

        {/* Description of the list */}
        <div className="w-full md:w-1/2 mt-3 mb-6">
          <label
            className="block tracking-wide text-sm mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="appearance-none block w-full text-sm font-light bg-neutral-950 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
            id="description"
            name="description"
            placeholder="Liste des films préférés sortis en 2025"
          ></textarea>
          {state?.errors?.description && (
            <span className="text-red-500 text-xs italic">
              {state.errors.description.join(",")}
            </span>
          )}
        </div>

        {/* Movies Selection */}
        <div className="w-full md:w-1/2 mt-3 mb-6 md:mb-0">
          <label
            className="block tracking-wide text-sm mb-2"
            htmlFor="movie_search"
          >
            Films
          </label>
          <div className="relative">
            <input
              className="block appearance-none w-full text-sm font-light bg-neutral-950 border py-2 px-3 pr-8 rounded leading-tight focus:outline-none"
              id="movie_search"
              value={movieInput}
              onChange={handleMovieInputChange}
              placeholder="Tapez pour rechercher des films"
            />

            {/* Display movie options */}
            {isSearching && filteredMovies.length > 0 && (
              <ul className="absolute left-0 right-0 border bg-neutral-950 rounded-lg text-sm font-light border-gray-300 mt-1 z-10">
                {filteredMovies.map((movie) => (
                  <li
                    key={movie.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-800"
                    onClick={() => handleAddMovie(movie)}
                  >
                    <div className="font-medium flex gap-2 items-center">
                      {movie.title}
                      <span className="font-light text-gray-400">
                        {movie.release_date}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <input
              type="hidden"
              name="movie_id"
              value={selectedMovies.map((movie) => movie.id).join(",")}
            />
          </div>

          {/* Display selected movies as tags */}
          <div className="mt-3 mb-6">
            {selectedMovies.map((movie) => (
              <span
                key={movie.id}
                className="inline-flex items-center bg-rose-100 text-rose-500 text-xs font-medium mr-2 px-3 py-1 rounded"
              >
                {movie.title}
                <button
                  type="button"
                  onClick={() => handleRemoveMovie(movie.id)}
                  className="ml-2 text-rose-500 hover:text-rose-700"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
};

export default CreateListPage;
