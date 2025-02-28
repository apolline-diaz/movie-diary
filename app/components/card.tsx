import Image from "next/image";
import Link from "next/link";

interface CardProps {
  id: number;
  title: string;
  directors: {
    name: string;
  } | null;
  description: string;
  releaseDate: string;
  image_url: string;
}

export default function Card({
  id,
  title,
  description,
  releaseDate,
  image_url,
}: CardProps) {
  const isSupabaseImage = image_url.startsWith(
    "https://xcwrhyjbfgzsaslstssc.supabase.co"
  );
  const isMubiImage = image_url.startsWith("https://images.mubicdn.net");

  return (
    <Link
      href={{
        pathname: `/movies/${id}`,
        query: {
          id,
          title,
          description: encodeURI(description),
          releaseDate,
          image_url,
        },
      }}
    >
      <div className="group overflow-hidden flex flex-col transition-transform">
        <div className="relative w-full h-48 overflow-hidden ">
          <Image
            src={image_url}
            fill={true}
            alt={title}
            className="object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-50"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/640x360";
            }}
          />
          <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-md font-semibold uppercase">{title}</div>
            <p className="text-sm text-gray-300">{releaseDate}</p>
            <p className="absolute text-sm text-gray-100 mt-2">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
