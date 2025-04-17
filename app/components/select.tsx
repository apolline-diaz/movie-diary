"use client";

import React from "react";

interface SelectProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
}: SelectProps) {
  return (
    <div className="">
      {/* <label
        htmlFor={label}
        className="block text-sm font-medium text-white mb-2"
      >
        {label}
      </label> */}
      <select
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white font-light border hover:cursor-pointer border-rose-500 text-gray-500 text-sm rounded-lg focus:ring-white focus:border-white block w-full p-1"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
