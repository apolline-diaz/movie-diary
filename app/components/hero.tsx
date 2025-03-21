"use client";

import Image from "next/image";
import Link from "next/link";
import Searchfield from "./searchfield";

interface CardProps {
  id: string;
  title: string;
  image_url?: string | null;
}

export default function Hero({ id, title, image_url }: CardProps) {
  return (
    <div className="bg bg-gray-953 h-96 w-full justify-center items-center">
      <Link href={`/movies/${id}`}>
        <div className="h-full w-full relative bg-center">
          <Image
            src={image_url || "public/assets/missing_image.png"}
            fill={true}
            alt={title}
            style={{ objectFit: "cover" }}
          />
          <div className="absolute flex flex-col  items-left justify-center w-full h-full  line-clamp-2 px-10 py-5">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
            <div className="relative sm:w-[70%] xs:w-[100%] mb-5">
              <h2 className="text-2xl font-medium text-white">
                Le site de référence pour découvrir l&apos;histoire du cinéma{" "}
                <span className="text-transparent text-bold bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500">
                  LGBTQI+
                </span>{" "}
                et ses archives.
              </h2>
            </div>
            <Link
              href="/movies"
              className="relative w-[200px] bg-gradient-to-r from-rose-500 to-red-500 text-white
              px-4 py-2 rounded-md hover:from-rose-600 hover:to-red-600"
            >
              Explorer le catalogue
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
}
