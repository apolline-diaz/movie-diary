import { getMovie } from "@/app/server-actions/movies/get-movie";
import EditMovieForm from "./edit-movie-form";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/utils/auth";

export const metadata: Metadata = {
  title: "Edit Movie",
  description: "Edit a movie in the database",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { movie, error } = await getMovie(params.id);
  const session = await auth();

  // If no session exists, redirect to login page
  if (!session) {
    redirect("/login"); // Adjust the login path as needed
  }

  if (error || !movie) {
    return notFound();
  }

  return (
    <div className="px-10 py-20 flex justify-start">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl text-rose-500 mb-5">Modifier le film</h1>
        <EditMovieForm movie={movie} />
      </div>
    </div>
  );
}
