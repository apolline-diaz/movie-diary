"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import SearchField from "@/app/components/searchfield";

export default function Searchform() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (type: "title" | "keyword", value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(type, value);
      } else {
        params.delete(type);
      }

      // Clear the other search type when one is being used
      if (type === "title") params.delete("keyword");
      if (type === "keyword") params.delete("title");

      router.push(`/movies?${params.toString()}`);
    });
  };

  return (
    <div className="w-full">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="w-full xs:w-1/2 flex flex-col sm:flex-row gap-3">
          <SearchField
            value={searchParams.get("title") ?? ""}
            onChange={(value) => handleSearch("title", value)}
            placeholder="Entrez un titre"
          />
          <SearchField
            value={searchParams.get("keyword") ?? ""}
            onChange={(value) => handleSearch("keyword", value)}
            placeholder="Entrez un mot-clé"
          />
        </div>
      </form>
      {/* {isPending && <div className="mt-2">Recherche en cours...</div>} */}
    </div>
  );
}
