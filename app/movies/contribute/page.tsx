"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { addMovie } from "@/app/server-actions/movies/add-movie";
import { SubmitButton } from "@/app/components/submit-button";
import {
  getGenres,
  getCountries,
  getKeywords,
} from "@/utils/get-data-to-upload-movie";

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
    const fetchData = async () => {
      const [genresData, countriesData, keywordsData] = await Promise.all([
        getGenres(),
        getCountries(),
        getKeywords(),
      ]);
      setGenres(genresData);
      setCountries(countriesData);
      setKeywords(keywordsData);
    };
    fetchData();
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
      <div className="tracking-wide text-rose-500 text-xl mb-5">
        Ajouter un film au catalogue
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
            className="block tracking-wide text-white text-sm mb-2"
            htmlFor="title"
          >
            Titre
          </label>
          <input
            className="appearance-none block w-full bg-neutral-950 border-b border-b-white text-white font-light text-sm py-3 mb-3 leading-tight focus:outline-none"
            id="title"
            type="text"
            name="title"
            placeholder="D.E.B.S"
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
        <div className="w-full md:w-1/2 mb-6">
          <label
            className="block tracking-wide text-white text-sm mb-2"
            htmlFor="director_name"
          >
            Réalisateur-ice
          </label>
          <input
            className="appearance-none block w-full bg-neutral-950 border-b border-b-white text-white font-light text-sm py-3 mb-3 leading-tight focus:outline-none "
            id="director_name"
            type="text"
            name="director_name"
            placeholder="Angela Robinson"
          />
          {state?.errors?.director_name && (
            <span
              id="director_name-error"
              className="text-red-500 text-xs italic"
            >
              {state.errors.director_name.join(",")}
            </span>
          )}
        </div>

        {/* synopsis */}
        <div className="w-full md:w-1/2 mb-6 mt-3">
          <label
            className="block  tracking-wide text-white text-sm mb-2"
            htmlFor="description"
          >
            Synopsis
          </label>
          <textarea
            className="appearance-none text-sm block w-full font-light bg-neutral-950 border-b-white text-white border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
            id="description"
            name="description"
            placeholder="Le D.E.B.S. est un groupe d'élite dont la mission est de protéger le pays. Ses membres sont des jeunes femmes recrutées dans les campus."
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
            className="block tracking-wide text-white text-sm mb-2"
            htmlFor="release_date"
          >
            Année de sortie
          </label>
          <div className="relative">
            <select
              className="appearance-none block w-full bg-neutral-950 font-light text-sm border-b-white text-white border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
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
            className="block  tracking-wide text-white text-sm mb-3"
            htmlFor="country"
          >
            Pays
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full text-sm font-light bg-neutral-950 border-b-white border border-gray-200 text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none "
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

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
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
            className="block tracking-wide text-white text-sm mb-2"
            htmlFor="runtime"
          >
            Durée (minutes)
          </label>
          <input
            className="appearance-none block w-full font-light text-sm bg-neutral-950 border-b-white text-white border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
            id="runtime"
            type="number"
            name="runtime"
            min="1"
            placeholder="91"
          />
        </div>
        {/* genre */}
        <div className="w-full md:w-1/3 mt-3 mb-6 md:mb-0">
          <label
            className="block  tracking-wide text-white text-sm mb-2"
            htmlFor="genre_id"
          >
            Genre
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full font-light text-sm bg-neutral-950 border-b-white border border-gray-200 text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none "
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

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
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
            className="block tracking-wide text-white text-sm mb-2"
            htmlFor="keyword_id"
          >
            Mots-clés
          </label>
          <div className="relative">
            {/* <input
              className="block appearance-none w-full bg-neutral-950 border-b-white text-white border py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
              name="keyword_id"
              value={selectedKeywords.map((keyword) => keyword.id).join(",")}
              onChange={handleKeywordInputChange}
              placeholder="Tapez pour rechercher des mots-clés"
            /> */}
            <input
              className="block appearance-none w-full font-light text-sm bg-neutral-950 border-b-white text-white border py-2 px-3 pr-8 rounded leading-tight focus:outline-none"
              id="keyword_input"
              name="keyword_input"
              value={keywordInput}
              onChange={handleKeywordInputChange}
              placeholder="Tapez pour rechercher des mots-clés"
            />

            {/* display keywords options*/}
            {keywordInput && filteredKeywords.length > 0 && (
              <ul className="absolute left-0 right-0 font-light text-xs bg-neutral-950 rounded-md border border-gray-300 mt-1 z-10 hover:bg-rose-500">
                {filteredKeywords.map((keyword) => (
                  <li
                    key={keyword.id}
                    className="px-4 py-2 cursor-pointer hover:bg-neutral-950 border-b-white"
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
                className="inline-flex items-center bg-rose-100 text-rose-500 text-sm font-medium mr-2 px-2 py-1 rounded"
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
            className="block tracking-wide text-white text-sm mb-2"
            htmlFor="image_url"
          >
            Image
          </label>
          <input
            className="appearance-none block w-full hover:cursor-pointer"
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
