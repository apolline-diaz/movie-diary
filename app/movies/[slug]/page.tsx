import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { getImageUrl, getCanonicalUrl } from "@/utils/index";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

export const revalidate = 0;

type Props = {
  params: { slug: string };
};

// MetaData for accessibility (missing types for movie and others data : to update)

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const id = params.slug;

//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );
//   const { data: movie } = await supabase
//     .from("movies")
//     .select(
//       `id,
//        title,
//        description,
//        image_url,
//        release_date,
//        runtime,
//        directors(id, first_name, last_name),
//        countries(id, name),
//        movie_genres(genre_id, genres(name))
//        movie_keywords(keyword_id, keywords(name))`
//     )
//     .eq("id", params.slug)
//     .single();

//   if (!movie) {
//     return { title: "", description: "" };
//   }

//   return {
//     title: movie.title,
//     description: movie.description,
//     openGraph: {
//       images: [getImageUrl(movie.image_url)],
//     },
//     alternates: {
//       canonical: `/movies/${id}`,
//     },
//   };
// }

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: movies } = await supabase.from("movies").select("id");

  const { data } = await supabase.auth.getUser();
  const user = data?.user || null;

  if (!movies) {
    return [];
  }

  return movies.map((movie) => ({
    slug: movie.id.toString(),
  }));
}

export default async function Page({ params }: Props) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase.auth.getUser();
  const user = data?.user || null;

  const { data: movie, error } = await supabase
    .from("movies")
    .select(
      "id, title, description, image_url, release_date, runtime, directors(id, first_name, last_name), genres(id, name), keywords(id, name), countries(id, name)"
    )
    .eq("id", params.slug)
    .single();

  if (error) {
    return <div>Erreur lors du chargement du film : {error.message}</div>;
  }

  if (!movie) {
    return <div>Film introuvable</div>;
  }

  console.log(movie);

  return (
    <>
      <div className="w-full mx-auto min-h-screen">
        <div className="h-96 relative">
          <Image
            className=""
            fill={true}
            alt={movie.title}
            style={{ objectFit: "cover" }}
            src={getImageUrl(movie.image_url)}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 w-full h-full text-white p-10 flex justify-between items-end">
            <div className="flex flex-col ">
              <h2 className="text-3xl font-bold uppercase">{movie.title}</h2>
              <h2 className="text-lg font-light ">
                {movie.directors
                  ?.map(
                    (director) => `${director.first_name} ${director.last_name}`
                  )
                  .join(", ")}
              </h2>
            </div>
            <div className="flex flex-col font-light items-end justify-end text-right">
              <span className="">
                {movie.countries?.map((country) => country.name).join(", ")},{" "}
                {movie.release_date}
              </span>
              <span>{movie.runtime}&#x27;</span>
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-4">
          <Link href={`/movies/edit/${movie.id}`}>
            <button className="bg-pink-400 text-white px-4 py-2 rounded-md hover:bg-pink-600">
              Modifier
            </button>
          </Link>
        </div>

        <div className="p-10 gap-3 flex flex-col">
          <div className="font-bold ">
            Synopsis
            <p className="py-2 font-light">{movie.description}</p>
          </div>
          <div className="font-bold">
            Genre
            <span className="font-light p-2">
              {movie.genres?.map((genre) => genre.name).join(", ")}
            </span>
          </div>
          <div className="font-bold flex items-center flex-wrap gap-2">
            Mots-clé
            <p className="flex flex-wrap gap-2">
              {movie.keywords?.map((keyword) => (
                <span
                  key={keyword.id}
                  className="font-light text-sm rounded-full border border-black p-1.5"
                >
                  {keyword.name}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
