"use client";

import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  name: string;
  control: any;
  options: Option[];
  label: string;
  placeholder?: string;
  onChange: (selected: Option[]) => void;
  defaultValues?: Option[];
}

export default function MoviesMultiSelect({
  name,
  control,
  options,
  label,
  placeholder,
  onChange,
  defaultValues = [],
}: MultiSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [selectedOptions, setSelectedOptions] =
    useState<Option[]>(defaultValues);

  // Met à jour les options filtrées quand l’utilisateur tape
  useEffect(() => {
    setFilteredOptions(
      options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [options, inputValue]);

  useEffect(() => {
    // Assure que les films sélectionnés sont bien affichés au chargement
    setSelectedOptions(defaultValues);
  }, [defaultValues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSelectMovie = (option: Option) => {
    // Vérifie si le film est déjà sélectionné
    if (!selectedOptions.some((item) => item.value === option.value)) {
      const updatedSelection = [...selectedOptions, option];
      setSelectedOptions(updatedSelection);
      onChange(updatedSelection); // Mise à jour du form
    }
    setInputValue(""); // Vide le champ de recherche après la sélection
  };

  const handleRemoveMovie = (option: Option) => {
    const updatedSelection = selectedOptions.filter(
      (item) => item.value !== option.value
    );
    setSelectedOptions(updatedSelection);
    onChange(updatedSelection);
  };

  return (
    <div className="col-span-2 relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValues}
        render={({ field }) => {
          return (
            <div className="relative">
              {/* Input de recherche */}
              <input
                type="text"
                className="block appearance-none w-full text-sm font-light p-2 border placeholder-gray-500 rounded-md bg-white border-rose-500"
                placeholder={placeholder || "Rechercher..."}
                value={inputValue}
                onChange={handleInputChange}
              />

              {/* Liste déroulante des suggestions */}
              {inputValue && filteredOptions.length > 0 && (
                <ul className="absolute left-0 right-0 uppercase bg-rose-100 border-rose-500 text-rose-500 text-sm rounded-md border mt-1 z-10 max-h-40 overflow-y-auto">
                  {filteredOptions.map((option) => (
                    <li
                      key={option.value}
                      className="px-4 py-2 hover:text-white cursor-pointer hover:bg-rose-500"
                      onClick={() => handleSelectMovie(option)}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}

              {/* Films sélectionnés affichés sous l’input */}
              <div className="mt-3 flex flex-col gap-2">
                {selectedOptions.map((option) => (
                  <span
                    key={option.value}
                    className=" uppercase flex border border-rose-500 justify-between items-center bg-rose-100 text-rose-500 text-sm font-medium px-2 py-1 rounded"
                  >
                    {option.label}
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-500"
                      onClick={() => handleRemoveMovie(option)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
