"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";

interface CardProps {
  id: string;
  title: string;
  image_url?: string | null;
}

export default function Hero({ id, title, image_url }: CardProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/movies?search=${encodeURIComponent(searchQuery)}&searchMode=field`
      );
    }
  };

  return (
    <div className="relative bg-black min-h-screen w-full">
      <div className="relative w-full h-[100vh]">
        <Image
          src={getImageUrl(image_url)}
          alt={title}
          priority
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center pt-18 px-10 gap-y-8">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          <div className="relative font-semibold w-full sm:text-5xl text-4xl ">
            <h2 className=" text-white text-center">
              Découvrez l&apos;histoire du cinéma{" "}
              <span className="text-transparent text-bold bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500">
                LGBTQI+
              </span>{" "}
              et ses archives.
            </h2>
          </div>
          {/* Barre de recherche qui redirige vers /movies */}
          <div className="z-10 flex flex-col sm:flex-row gap-5 justify-center items-center">
            <div className="flex flex-row items-center bg-black justify-center border rounded-xl px-4 border-white">
              <input
                type="text"
                className="z-10 max-h-12  min-w-52 flex-1 py-4 bg-black text-white focus:outline-none"
                placeholder="Rechercher un mot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              {isSearching ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-1"></div>
              ) : (
                <Icon
                  icon="radix-icons:magnifying-glass"
                  fontSize={20}
                  onClick={handleSearch}
                  className="hover:cursor-pointer hover:text-rose-500 transition-colors"
                />
              )}
            </div>
            <Link
              href="/movies"
              className="relative flex flex-row gap-1 items-center bg-gradient-to-r from-rose-500 to-red-500 text-white
            px-4 py-3 rounded-xl hover:from-rose-600 hover:to-red-600"
            >
              Explorer le catalogue
              <Icon icon="uis:angle-right" fontSize={25} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
