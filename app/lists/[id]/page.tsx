"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Card from "@/app/components/card";

export default function ListPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [listData, setListData] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération des informations de la liste
        const { data: list, error: listError } = await supabase
          .from("lists")
          .select("*")
          .eq("id", id)
          .single();

        if (listError) {
          console.error(
            "Erreur lors de la récupération de la liste :",
            listError.message
          );
          return;
        }

        setListData(list);

        // Récupération des films liés à la liste
        const { data: listsMovies, error: moviesError } = await supabase
          .from("lists_movies")
          .select("movie_id, added_at")
          .eq("list_id", id);

        if (moviesError) {
          console.error(
            "Erreur lors de la récupération des films :",
            moviesError.message
          );
          return;
        }

        // Récupération des informations détaillées des films
        const movieDetails = await Promise.all(
          listsMovies.map(async ({ movie_id }) => {
            const { data: movie, error: movieError } = await supabase
              .from("movies")
              .select("*")
              .eq("id", movie_id)
              .single();

            if (movieError) {
              console.error(
                `Erreur lors de la récupération du film ${movie_id} :`,
                movieError.message
              );
              return null;
            }
            return movie;
          })
        );

        // Filtrer les résultats valides
        setMovies(movieDetails.filter((movie) => movie !== null));
      } catch (error) {
        console.error("Erreur inattendue :", error);
      }
    };

    fetchData();
  }, [id]);

  if (!listData) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-xl text-rose-500 font-semibold">{listData.title}</h1>
      <p className="text-white mt-2 mb-6">{listData.description}</p>
      <button
        onClick={() => router.push(`/lists/edit/${id}`)}
        className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-2 rounded-md hover:from-rose-600  hover:to-red-600"
      >
        Modifier la liste
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        {movies.map((movie) => (
          <Card
            key={movie.id}
            id={movie.id}
            title={movie.title}
            release_date={movie.release_date}
            image_url={movie.image_url}
          />
        ))}
      </div>
    </div>
  );
}
