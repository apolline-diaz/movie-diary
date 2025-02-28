"use client";

import React from "react";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function SearchField({
  value,
  onChange,
  placeholder,
}: SearchFieldProps) {
  return (
    <input
      className="appearance-none text-md font-light block w-full bg-neutral-950 border-b border-b-white text-gray-700 py-3 leading-tight focus:outline-none"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
