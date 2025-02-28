import Image from "next/image";
import Link from "next/link";

// Define the CardProps interface
interface CardProps {
  id: number;
  title: string;
  // director: string;
  description: string;
  release_date: string;
  image_url: string;
}

export default function Hero({
  id,
  title,
  description,
  release_date,
  image_url,
}: CardProps) {
  return (
    <div className="bg bg-gray-953 h-96 w-full justify-center items-center">
      <Link
        href={{
          pathname: `/movies/${id}`,
          // href={{
          //    pathname: `/movies/${id}`,
          query: {
            id,
            title,
            description: encodeURI(description),
            release_date,
            image_url,
          },
        }}
      >
        <div className="h-full w-full relative bg-center">
          <Image
            src={image_url}
            fill={true}
            alt={title}
            style={{ objectFit: "cover" }}
          />
          <div className="absolute flex flex-col bg-black bg-opacity-50 items-left justify-center w-full h-full  line-clamp-2 px-10 py-5">
            <div className="w-[70%] lg:w-[60%] mb-5">
              <h2 className="text-xl font-light text-white">
                Une large base de données pour découvrir l histoire du cinéma{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500">
                  LGBTQI+
                </span>{" "}
                et les archives audiovisuelles.
              </h2>
            </div>
            <Link
              href="/movies"
              className="w-[200px] bg-gradient-to-r from-rose-500 to-red-500 text-white
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
