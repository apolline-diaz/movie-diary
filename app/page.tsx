import HomeCard from "@/app/components/home-card";
import { getImageUrl } from "@/utils";
import Hero from "./components/hero";
import {
  getMoviesByGenre,
  getMoviesByYearRange,
  getTopMovies,
} from "@/app/server-actions/movies";

export const revalidate = 0;

export default async function Home() {
  try {
    const topMovies = await getTopMovies();
    const dramaMovies = await getMoviesByGenre(13);
    const comedyMovies = await getMoviesByGenre(15);
    const documentaryMovies = await getMoviesByGenre(9);
    const ninetiesMovies = await getMoviesByYearRange("1990", "1999");

    return (
      <main className="w-full">
        <div className="w-full cover">
          {topMovies.map((movie) => (
            <Hero
              key={`${movie.title}-${movie.id}`}
              {...movie}
              image_url={getImageUrl(movie.image_url || "")}
            />
          ))}
        </div>

        <div className="px-10 py-5">
          {/* Drama Movies */}
          <h2 className="text-xl mb-2 text-rose-500">Drame</h2>
          <div className="flex flex-row-1 mb-5 overflow-auto sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {dramaMovies.map((movie) => (
              <HomeCard
                key={`${movie.title}-${movie.id}`}
                {...movie}
                release_date={movie.release_date || ""}
                image_url={getImageUrl(movie.image_url || "")}
              />
            ))}
          </div>

          {/* Comedy Movies */}
          <h2 className="text-xl mb-2 text-rose-500">Comédie</h2>
          <div className="flex flex-row-1 mb-5 overflow-auto gap-5">
            {comedyMovies.map((movie) => (
              <HomeCard
                key={`${movie.title}-${movie.id}`}
                {...movie}
                release_date={movie.release_date || ""}
                image_url={getImageUrl(movie.image_url || "")}
              />
            ))}
          </div>

          {/* Documentary Movies */}
          <h2 className="text-xl mb-2 text-rose-500">Documentaire</h2>
          <div className="flex flex-row-1 mb-5 overflow-auto gap-5">
            {documentaryMovies.map((movie) => (
              <HomeCard
                key={`${movie.title}-${movie.id}`}
                {...movie}
                release_date={movie.release_date || ""}
                image_url={getImageUrl(movie.image_url || "")}
              />
            ))}
          </div>

          {/* Nineties Movies */}
          <h2 className="text-xl mb-2 text-rose-500">Années 90</h2>
          <div className="flex flex-row-1 mb-5 overflow-auto gap-5">
            {ninetiesMovies.map((movie) => (
              <HomeCard
                key={`${movie.title}-${movie.id}`}
                {...movie}
                release_date={movie.release_date || ""}
                image_url={getImageUrl(movie.image_url || "")}
              />
            ))}
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <p>Erreur lors du chargement des films : {(error as Error).message}</p>
    );
  }
}
