import { getMovie } from "@/app/server-actions/movies/get-movie";
import EditMovieForm from "./edit-movie-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Movie",
  description: "Edit a movie in the database",
};

export default async function EditMoviePage({
  params,
}: {
  params: { id: string };
}) {
  const { movie, error } = await getMovie(params.id);

  if (error || !movie) {
    return notFound();
  }

  return (
    <div className="p-10 flex justify-start">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl text-rose-500 font-medium mb-5">Modifier</h1>
        <EditMovieForm movie={movie} />
      </div>
    </div>
  );
}
