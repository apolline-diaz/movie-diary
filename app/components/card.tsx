import { Icon } from "@iconify/react";
import { DeleteModal } from "./delete-modal";
import { getImageUrl } from "@/utils";
import Link from "next/link";
import { deleteMovie } from "../server-actions/movies/delete-movie";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  const router = useRouter();

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
            <Image
              src={getImageUrl(image_url)}
              alt={title}
              priority
              className="object-cover w-full h-full transform transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-50"
            />
            <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-md font-semibold uppercase">{title}</div>
              <p className="text-sm text-gray-300">{release_date}</p>
              {/* <p className="absolute text-sm text-gray-200 mt-2">{description}</p> */}
            </div>
          </Link>

          {userIsAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-2 right-2 z-10 bg-black bg-opacity-60 p-2 rounded-full text-rose-500 transition-all duration-300 ease-in-out opacity-100 visible hover:bg-rose-500 hover:text-white"
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
