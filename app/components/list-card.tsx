"use client";

import { Image } from "@/app/components/image";
import { getImageUrl } from "@/utils";
import Link from "next/link";
import { DeleteModal } from "./delete-modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteList } from "../server-actions/lists/delete-list";
import { Icon } from "@iconify/react";

interface List {
  id: string;
  title: string;
  description?: string;
  lists_movies: {
    movie: {
      id: string;
      image_url?: string | null;
      title: string;
    };
  }[];
}

interface ListCardProps {
  list: List;
}

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
  const firstMoviePoster = list.lists_movies[0]?.movie?.image_url;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation vers la page de liste
    e.stopPropagation(); // Empêche la propagation jusqu'au lien parent
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteList(BigInt(list.id));

      if (result.success) {
        // La revalidation du chemin se fait dans la server action
        router.refresh(); // Force un rafraîchissement de la page
      } else {
        // Gérer l'erreur (vous pourriez ajouter un state pour afficher l'erreur)
        console.error(result.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };
  return (
    <div className="gap-4 relative group">
      <div className="group rounded-xl overflow-hidden flex flex-col transition-transform">
        <div className="relative h-48 overflow-hidden">
          <Link href={`/lists/${list.id}`}>
            <Image
              src={getImageUrl(firstMoviePoster)}
              alt={list.title}
              className="object-cover w-full h-full z-20 transform transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-50"
              title={list.title}
            />

            <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col p-4 text-white uppercase justify-end">
              <div className="text-xl font-semibold line-clamp-2">
                {list.title}
              </div>
            </div>
          </Link>

          <button
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 z-10 bg-black bg-opacity-60 p-2 rounded-full text-rose-500 transition-all duration-300 ease-in-out opacity-100 visible hover:bg-rose-500 hover:text-white"
            title="Supprimer cette liste"
          >
            <Icon icon="lucide:trash" style={{ fontSize: 15 }} />
          </button>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={list.title}
      />
    </div>
  );
};
