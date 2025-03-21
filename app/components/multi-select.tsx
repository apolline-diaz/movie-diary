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

export default function MultiSelect({
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

  // Update filtered options when options prop changes
  useEffect(() => {
    setFilteredOptions(
      options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [options, inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setFilteredOptions(
      options.filter((opt) =>
        opt.label.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div className="col-span-2 relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValues}
        render={({ field }) => {
          // Ensure field.value is always an array of Option objects
          const safeValue = Array.isArray(field.value)
            ? field.value.map((item) => {
                // If item is just a string (value), try to find the corresponding Option
                if (typeof item === "string") {
                  const matchingOption = options.find(
                    (opt) => opt.value === item
                  );
                  return matchingOption || { value: item, label: item };
                }
                // If it's an object but missing label, add a fallback label
                if (typeof item === "object" && item !== null && !item.label) {
                  const matchingOption = options.find(
                    (opt) => opt.value === item.value
                  );
                  return matchingOption || { ...item, label: item.value };
                }
                return item;
              })
            : [];

          return (
            <div className="relative">
              {/* Input Field for Searching */}
              <input
                type="text"
                className="block appearance-none w-full text-sm font-light p-2 border rounded-md bg-transparent"
                placeholder={placeholder || "Rechercher..."}
                value={inputValue}
                onChange={handleInputChange}
              />

              {/* Dropdown Suggestions */}
              {inputValue && filteredOptions.length > 0 && (
                <ul className="absolute left-0 right-0 bg-black rounded-md border mt-1 z-10 max-h-40 overflow-y-auto">
                  {filteredOptions.map((option) => (
                    <li
                      key={option.value}
                      className="px-4 py-2 cursor-pointer hover:bg-rose-500"
                      onClick={() => {
                        // Check if the option is already selected
                        const isAlreadySelected = safeValue.some(
                          (item: Option) => item.value === option.value
                        );

                        if (!isAlreadySelected) {
                          const updatedSelection = [...safeValue, option];
                          field.onChange(updatedSelection); // Update form field value
                          onChange(updatedSelection); // Call parent onChange prop
                        }
                        setInputValue(""); // Reset input
                      }}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}

              {/* Selected Items */}
              <div className="mt-3 flex flex-wrap gap-2">
                {safeValue.map((option: Option) => (
                  <span
                    key={option.value}
                    className="inline-flex items-center bg-rose-100 text-rose-500 text-sm font-medium px-2 py-1 rounded"
                  >
                    {option.label}
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => {
                        const newValue = safeValue.filter(
                          (item: Option) => item.value !== option.value
                        );
                        field.onChange(newValue);
                        onChange(newValue);
                      }}
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
