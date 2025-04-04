import { Icon } from "@iconify/react/dist/iconify.js";
import { DeleteModal } from "./delete-modal";
import { getImageUrl } from "@/utils";
import Link from "next/link";
import { deleteMovie } from "../server-actions/movies/delete-movie";
import { addMovieToList } from "../server-actions/lists/add-movie-to-list";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getLists } from "../server-actions/lists/get-lists";
import { Image } from "@/app/components/image";

interface CardProps {
  id: string;
  title: string;
  image_url?: string | null;
  userIsAdmin: boolean;
  release_date?: string | null;
}

export default function Card({
  id,
  title,
  image_url,
  userIsAdmin,
  release_date,
}: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lists, setLists] = useState<{ id: string; title: string }[]>([]);
  const router = useRouter();

  const handleOpenMenu = async () => {
    if (!isMenuOpen) {
      const userLists = await getLists();
      setLists(userLists);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAddToList = async (listId: string) => {
    await addMovieToList(listId, id);
    setIsMenuOpen(false);
    router.refresh();
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteMovie(id);
      if (result.success) {
        router.refresh();
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  // **Ici on s'assure de retourner un JSX valide !**
  return (
    <div className="gap-4 relative group">
      <div className="group rounded-xl overflow-hidden flex flex-col transition-transform">
        <div className="relative h-48 overflow-hidden">
          <Link href={`/movies/${id}`}>
            {/* // eslint-disable-next-line react/jsx-no-undef */}
            <Image
              src={getImageUrl(image_url)}
              fill={true}
              alt={title}
              className="object-cover w-full h-full transform transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-50"
              title={title}
            />
            <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-md font-semibold uppercase">{title}</div>
              <p className="text-sm text-gray-300">{release_date}</p>
              {/* <p className="absolute text-sm text-gray-200 mt-2">{description}</p> */}
            </div>
          </Link>
        </div>
        <div className="absolute flex items-center rounded-xl p-2 top-0 justify-between w-full">
          <button
            onClick={handleOpenMenu}
            aria-label="Ajouter le film à une liste"
            className="relative z-5 p-2 m-2 right-0 bg-gray-800 rounded-full transition-all duration-300 ease-in-out hover:bg-gray-700"
          >
            <Icon icon="lucide:plus" style={{ fontSize: 15 }} />
          </button>
          {isMenuOpen && (
            <div className="z-10 top-14 rounded-xl absolute w-3/4 text-white bg-black shadow-lg">
              {lists.length === 0 ? (
                <p className="text-sm text-gray-500">Aucune liste trouvée</p>
              ) : (
                lists.map((list) => (
                  <div
                    key={list.id}
                    className="px-3 py-2 gap-2 text-sm font-light flex justify-between items-center hover:rounded-xl hover:bg-gray-900 cursor-pointer"
                  >
                    <span>{list.title}</span>
                    <button
                      onClick={() => handleAddToList(list.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Icon icon="lucide:plus" style={{ fontSize: 15 }} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
          {userIsAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="right-2 z-5 bg-black bg-opacity-60 p-2 rounded-full text-rose-500 transition-all duration-300 ease-in-out opacity-100 visible hover:bg-rose-500 hover:text-white"
              title="Supprimer ce film"
            >
              <Icon icon="lucide:trash" style={{ fontSize: 15 }} />
            </button>
          )}
        </div>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={title}
      />
    </div>
  );
}
