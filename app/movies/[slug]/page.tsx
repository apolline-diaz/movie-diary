import { Image } from "@/app/components/image";
import { getImageUrl } from "@/utils/index";
import { getMovie } from "@/app/server-actions/movies/get-movie";
import Link from "next/link";
import { isAdmin } from "@/utils/is-user-admin";
import ClientMovieActions from "./client";
import { auth } from "@/utils/auth";

export const revalidate = 0;

type Props = {
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  const { movie, error } = await getMovie(params.slug);
  const userIsAdmin = await isAdmin();
  const session = await auth();

  if (error) {
    return <div>Erreur lors du chargement du film : {error}</div>;
  }

  if (!movie) {
    return <div>Film introuvable</div>;
  }

  // Determine if we display "min" or "saison(s)" depending on the type
  const durationText = movie.type === "Série" ? " saison(s)" : "min";

  return (
    <div className="w-full text-white mx-auto min-h-screen">
      {session && (
        <ClientMovieActions
          movieId={movie.id.toString()}
          userIsAdmin={userIsAdmin}
        />
      )}
      <div className="h-[75vh] relative">
        <Image
          className="object-cover w-full h-full"
          alt={movie.title}
          src={getImageUrl(movie.image_url)}
          title={movie.title}
        />

        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 w-full h-full text-white p-10 flex justify-between items-end">
          <div className="flex flex-col ">
            <h2 className="text-3xl font-bold uppercase">{movie.title}</h2>
            <h2 className="text-lg font-light ">
              {movie.directors?.length > 0 && (
                <span>
                  {movie.directors.map((director) => director.name).join(", ")}
                </span>
              )}
            </h2>
          </div>
        </div>
      </div>
      <div className="p-10 gap-3 flex flex-col">
        <div className="flex flex-col font-light">
          <span className="font-semibold text-rose-500">
            {movie.countries?.map((country) => country.name).join(", ")} •{" "}
            {movie.release_date} •{" "}
            {movie.runtime ? `${movie.runtime}${durationText}` : ""} •{" "}
            {movie.type}
          </span>
        </div>
        <div className="font-bold">
          {movie?.genres?.length > 0 && (
            <span className="font-light text-rose-500 pr-2">
              {movie.genres.map((genre) => genre.name).join(", ")}
            </span>
          )}
        </div>
        <p className="py-2 font-light text-black">{movie.description}</p>
        <div className="font-bold flex items-center flex-wrap gap-2">
          {movie.keywords?.map((keyword) => (
            <Link
              key={keyword.id}
              href={`/movies?keywordIds=${encodeURIComponent(keyword.id.toString())}&searchMode=form`}
            >
              <span className="font-light text-sm rounded-full border border-rose-500 text-rose-500 px-2 mr-1 py-1 hover:bg-rose-500 hover:text-white hover:cursor-pointer">
                {keyword.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
