"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { addMovie } from "@/app/server-actions";
import { SubmitButton } from "@/app/components/submit-button";
import { supabase } from "@/lib/supabase";

const initialState = {
  type: "",
  message: "",
  errors: null,
};

const UploadFormPage: React.FC = () => {
  const [state, formAction] = useFormState<any>(addMovie as any, initialState);
  const [countries, setCountries] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<any[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      const { data, error } = await supabase.from("genres").select("id, name");
      if (error) {
        console.error("Erreur lors de la récupération des genres :", error);
      } else {
        setGenres(data);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from("countries")
        .select("id, name");
      if (error) {
        console.error("Erreur lors de la récupération des pays :", error);
      } else {
        setCountries(data);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchKeywords = async () => {
      const { data, error } = await supabase
        .from("keywords")
        .select("id, name");
      if (error) {
        console.error("Erreur lors de la récupération des mots-clés :", error);
      } else {
        setKeywords(data);
      }
    };

    fetchKeywords();
  }, []);

  // keyword field input management with auto-completion
  const handleKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordInput(e.target.value);
  };

  // add keyword to selection
  const handleAddKeyword = (keyword: any) => {
    if (!selectedKeywords.find((k) => k.id === keyword.id)) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
    setKeywordInput("");
  };

  // remove a selected keyword
  const handleRemoveKeyword = (id: number) => {
    setSelectedKeywords(selectedKeywords.filter((k) => k.id !== id));
  };

  // keywords suggested depending on the input of user
  const filteredKeywords = keywords.filter(
    (keyword) =>
      keyword.name.toLowerCase().includes(keywordInput.toLowerCase()) &&
      !selectedKeywords.find((k) => k.id === keyword.id) // avoid proposing keywords that have already been integrated
  );

  return (
    <div className="p-10">
      <div className="tracking-wide text-xl mb-5">
        Ajoutez un film au catalogue
      </div>
      {state?.type === "error" && (
        <p id="title-error" className="text-red-500 text-xs italic">
          {state.message}
        </p>
      )}
      <form action={formAction} className="py-5">
        {/* title */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="title"
          >
            Titre
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="title"
            type="text"
            name="title"
          />
          {state?.errors?.title && (
            <span
              id="description-error"
              className="text-red-500 text-xs italic"
            >
              {state.errors.title.join(",")}
            </span>
          )}
        </div>
        {/* director */}
        {/* director first_name */}
        <div className="w-full md:w-1/2 mb-6">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="director_first_name"
          >
            Prénom du réalisateur
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="director_first_name"
            type="text"
            name="director_first_name"
          />
          {state?.errors?.director_first_name && (
            <span
              id="director_first_name-error"
              className="text-red-500 text-xs italic"
            >
              {state.errors.director_first_name.join(",")}
            </span>
          )}
        </div>

        {/* director last_name */}
        <div className="w-full md:w-1/2 mb-6">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="director_last_name"
          >
            Nom du réalisateur
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="director_last_name"
            type="text"
            name="director_last_name"
          />
          {state?.errors?.director_last_name && (
            <span
              id="director_last_name-error"
              className="text-red-500 text-xs italic"
            >
              {state.errors.director_last_name.join(",")}
            </span>
          )}
        </div>

        {/* synopsis */}
        <div className="w-full md:w-1/2">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="description"
          >
            Synopsis
          </label>
          <textarea
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="description"
            name="description"
          ></textarea>
          {state?.errors?.description && (
            <span
              id="description-error"
              className="text-red-500 text-xs italic"
            >
              {state.errors.description.join(",")}
            </span>
          )}
        </div>
        {/* release date */}
        <div className="w-full md:w-1/3 mb-6 mt-3 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="release_date"
          >
            Année de sortie
          </label>
          <div className="relative">
            <select
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="release_date"
              name="release_date"
            >
              <option value="">Sélectionnez une année</option>
              {Array.from(
                { length: new Date().getFullYear() + 1 }, // Créer un tableau jusqu'à l'année actuelle
                (_, i) => new Date().getFullYear() - i // Inverser l'ordre pour afficher de l'année actuelle à 0
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
            {state?.errors?.release_date && (
              <span
                id="release_date-error"
                className="text-red-500 text-xs italic"
              >
                {state.errors.release_date.join(",")}
              </span>
            )}
          </div>
        </div>
        {/* country */}
        <div className="w-full md:w-1/3 mt-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="country"
          >
            Pays
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-country"
              name="country_id"
            >
              <option value="">Sélectionnez un pays</option>
              {countries?.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        {/* runtime */}
        <div className="w-full md:w-1/5 mb-6 mt-3 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="runtime"
          >
            Durée (minutes)
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="runtime"
            type="number" // Utilisez type "number" pour la durée
            name="runtime"
            min="1" // Optionnel : Pour s'assurer que la durée est positive
          />
        </div>
        {/* genre */}
        <div className="w-full md:w-1/3 mt-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="genre_id"
          >
            Genre
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-genre"
              name="genre_id"
            >
              <option value="">Sélectionnez un genre</option>
              {genres?.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        {/* keywords */}
        <div className="w-full md:w-1/2 mt-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="keyword_id"
          >
            Mots-clés
          </label>
          <div className="relative">
            {/* <input
              className="block appearance-none w-full bg-gray-200 text-gray-700 border py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
              name="keyword_id"
              value={selectedKeywords.map((keyword) => keyword.id).join(",")}
              onChange={handleKeywordInputChange}
              placeholder="Tapez pour rechercher des mots-clés"
            /> */}
            <input
              className="block appearance-none w-full bg-gray-200 text-gray-700 border py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
              name="keyword_input" // Changer en un nom plus explicite
              value={keywordInput}
              onChange={handleKeywordInputChange}
              placeholder="Tapez pour rechercher des mots-clés"
            />

            {/* display keywords options*/}
            {keywordInput && filteredKeywords.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 z-10">
                {filteredKeywords.map((keyword) => (
                  <li
                    key={keyword.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleAddKeyword(keyword)}
                  >
                    {keyword.name}
                  </li>
                ))}
              </ul>
            )}
            <input
              type="hidden"
              name="keyword_id"
              value={selectedKeywords.map((keyword) => keyword.id).join(",")}
            />
          </div>
          {/* display selected keywords as tags*/}
          <div className="mt-3">
            {selectedKeywords.map((keyword) => (
              <span
                key={keyword.id}
                className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
              >
                {keyword.name}
                <button
                  type="button"
                  name="keyword_id"
                  onClick={() => handleRemoveKeyword(keyword.id)}
                  className="ml-2 text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
        {/* image */}
        <div className="w-full md:w-1/2 mt-3 mb-6">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="image_url"
          >
            Image
          </label>
          <input
            className="appearance-none block w-full hover:cursor"
            id="image_url"
            name="image_url"
            accept="image/*"
            type="file"
          />
          {state?.errors?.image_url && (
            <span id="image_url-error" className="text-red-500 text-xs italic">
              {state.errors.image_url.join(",")}
            </span>
          )}
        </div>
        <SubmitButton />
      </form>
    </div>
  );
};

export default UploadFormPage;
