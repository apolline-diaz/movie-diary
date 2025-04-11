"use client";

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Icon } from "@iconify/react";
import Card from "./card";
import { getImageUrl } from "@/utils";
import { useMovies, type MovieFilters } from "@/app/hooks/use-movies";

interface InfiniteMoviesListProps {
  filters: MovieFilters;
  userIsAdmin: boolean;
}

export default function InfiniteMoviesList({
  filters,
  userIsAdmin,
}: InfiniteMoviesListProps) {
  // Utilisation du hook d'intersection pour détecter quand l'utilisateur atteint le bas de la liste
  const { ref, inView } = useInView({
    threshold: 0.1,
    // Déclencher seulement quand l'élément est à 300px du viewport
    rootMargin: "300px",
  });

  // Utilisation du hook useMovies
  const {
    movies,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useMovies(filters);

  // Déclencher le chargement de la page suivante quand l'élément devient visible
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <div className="text-rose-500 border-b border-rose-500 text-md font-light mb-5">
        {isLoading ? (
          <div className="animate-pulse rounded-xl h-6 bg-gray-400 w-3/4 mb-2"></div>
        ) : (
          `${totalCount} films trouvés`
        )}
      </div>

      <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          // Skeleton loading
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl bg-gray-500 h-48 w-full justify-end max-w-xs mx-auto group overflow-hidden flex flex-col transition-transform"
            >
              <div className="flex flex-col p-5 space-y-2">
                <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-400 rounded w-1/3 mb-2"></div>
              </div>
            </div>
          ))
        ) : movies.length === 0 ? (
          <p>Aucun film trouvé</p>
        ) : (
          movies.map((movie) => (
            <Card
              key={`${movie.title}-${movie.id}`}
              {...movie}
              userIsAdmin={userIsAdmin}
              image_url={getImageUrl(movie.image_url || "")}
            />
          ))
        )}
      </div>

      {/* Élément qui déclenche le chargement de la page suivante */}
      {(hasNextPage || isFetchingNextPage) && (
        <div ref={ref} className="mt-4 py-4">
          {isFetchingNextPage ? (
            <div className="w-full flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : hasNextPage ? (
            <button
              onClick={() => fetchNextPage()}
              className="w-full flex flex-row justify-center items-center border-b border-t mt-4 px-4 py-2 hover:border-rose-500 text-white hover:text-rose-600"
            >
              Voir plus <Icon icon="mdi:chevron-down" className="size-5" />
            </button>
          ) : null}
        </div>
      )}
    </>
  );
}
