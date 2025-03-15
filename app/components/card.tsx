import Image from "next/image";
import Link from "next/link";

interface CardProps {
  id: string;
  title: string;
  directors: any;
  description: string;
  release_date: string | null;
  image_url: string | null;
}

export default function Card({
  id,
  title,
  image_url,
  description,
  release_date,
  directors,
}: CardProps) {
  return (
    <Link href={`/movie/${id}`} className="group">
      <div className="group overflow-hidden flex flex-col transition-transform">
        <div className="relative w-full h-48 overflow-hidden ">
          <Image
            src={image_url || "public/assets/missing_image.png"}
            fill
            alt={title}
            className="object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-50"
            onError={(e) => {
              e.currentTarget.src = "public/assets/no_image_found.png";
            }}
          />
          <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-md font-semibold uppercase">{title}</div>
            <p className="text-sm text-gray-300">{release_date}</p>
            <p className="absolute text-sm text-gray-200 mt-2">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
