"use client";

import { useState, useEffect, useCallback } from "react";
import { getLists } from "@/app/server-actions/lists/get-lists";
import { addMovieToList } from "@/app/server-actions/lists/add-movie-to-list";
import { removeMovieFromList } from "@/app/server-actions/lists/remove-movie-from-list";
import { checkMovieInLists } from "@/app/server-actions/lists/check-movie-in-lists";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

type Props = {
  movieId: string;
  userIsAdmin: boolean;
};

type ListWithStatus = {
  id: string;
  title: string;
  hasMovie: boolean;
};

export default function ClientMovieActions({ movieId, userIsAdmin }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lists, setLists] = useState<ListWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const router = useRouter();

  // Mémoriser la fonction avec useCallback
  const fetchListsWithStatus = useCallback(async () => {
    // Cette correction utilise useCallback pour mémoriser la fonction fetchListsWithStatus, ce qui garantit qu'elle ne sera recréée que lorsque movieId change.
    setIsLoading(true);
    try {
      // Exécuter ces requêtes en parallèle pour gagner du temps
      const [fetchedLists, movieInLists] = await Promise.all([
        getLists(),
        checkMovieInLists(movieId),
      ]);

      const listsWithStatus = fetchedLists.map((list) => ({
        ...list,
        hasMovie: movieInLists.includes(list.id),
      }));

      setLists(listsWithStatus);
      setIsDataFetched(true);
    } catch (error) {
      console.error("Erreur lors du chargement des listes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [movieId]); // movieId est la seule dépendance externe

  // Pré-charger les données dès le montage du composant
  useEffect(() => {
    const preloadData = async () => {
      if (!isDataFetched && !isLoading) {
        await fetchListsWithStatus();
      }
    };

    preloadData();
  }, [isDataFetched, isLoading, fetchListsWithStatus]); // Maintenant fetchListsWithStatus est inclus

  const toggleMenu = () => {
    // Simplement basculer l'état du menu sans attendre
    setIsMenuOpen(!isMenuOpen);

    // Si les données n'ont pas encore été chargées, les charger en arrière-plan
    if (!isDataFetched && !isLoading) {
      fetchListsWithStatus();
    }
  };

  const toggleMovieInList = async (
    listId: string,
    hasMovie: boolean,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    // Mettre à jour l'UI immédiatement (optimistic update)
    setLists(
      lists.map((list) =>
        list.id === listId ? { ...list, hasMovie: !hasMovie } : list
      )
    );

    // Exécuter l'action en arrière-plan
    try {
      if (hasMovie) {
        await removeMovieFromList(listId, movieId);
      } else {
        await addMovieToList(listId, movieId);
      }
    } catch (error) {
      // En cas d'erreur, revenir à l'état précédent
      console.error("Erreur lors de la mise à jour de la liste:", error);
      setLists(
        lists.map((list) =>
          list.id === listId ? { ...list, hasMovie: hasMovie } : list
        )
      );
    }
  };

  return (
    <div className="z-20 absolute flex flex-row pt-20 items-center rounded-xl px-10 top-0 justify-between w-full">
      <div className="relative">
        <button
          onClick={toggleMenu}
          aria-label="Gérer les listes"
          className="z-10 p-2 bg-black text-rose-500 rounded-full border bg-opacity-50 border-rose-500 transition-all duration-300 ease-in-out hover:bg-rose-500 hover:text-white"
        >
          <Icon
            icon={isLoading && !isDataFetched ? "lucide:loader" : "lucide:plus"}
            className={isLoading && !isDataFetched ? "animate-spin" : ""}
          />
        </button>

        {isMenuOpen && (
          <div className="absolute top-full mt-2 w-48 rounded-lg text-rose-500 bg-red-100 ">
            {lists.length === 0 ? (
              <p className="text-sm text-gray-500 px-3 py-2">
                {isLoading
                  ? "Chargement des listes..."
                  : "Aucune liste trouvée"}
              </p>
            ) : (
              lists.map((list) => (
                <div
                  key={list.id}
                  onClick={(e) => toggleMovieInList(list.id, list.hasMovie, e)}
                  className="px-3 py-2 gap-2 text-sm font-light flex justify-between items-center hover:rounded-xl hover:text-rose-500 cursor-pointer"
                >
                  <span>{list.title}</span>
                  <button
                    className="text-rose-500 hover:text-rose-700 focus:outline-none"
                    aria-label={
                      list.hasMovie
                        ? "Retirer de la liste"
                        : "Ajouter à la liste"
                    }
                  >
                    {list.hasMovie ? (
                      <Icon
                        icon="tdesign:circle-filled"
                        style={{ fontSize: 15 }}
                      />
                    ) : (
                      <Icon icon="lucide:circle" style={{ fontSize: 15 }} />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {userIsAdmin && (
        <div className="absolute top-20 right-4">
          <Link href={`/movies/edit/${movieId}`}>
            <button className="right-2 bg-black bg-opacity-60 p-2 mx-3 border border-rose-500 rounded-full text-rose-500 transition-all duration-300 ease-in-out opacity-100 visible hover:bg-rose-500 hover:text-white">
              <Icon icon="lucide:edit" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
