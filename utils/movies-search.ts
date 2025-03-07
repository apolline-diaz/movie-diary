import { supabase } from "@/lib/supabase";

interface Movie {
  id: string;
  title: string;
  image_url: string;
  release_date: string;
}

export const getMoviesByTitle = async (search: string): Promise<Movie[]> => {
  if (search.trim() === "") {
    // if research is empty get alll movies from last to older adding
    const { data: allMovies, error } = await supabase
      .from("movies")
      .select(
        `
        id, 
        title, 
        image_url, 
        release_date
      `
      )
      .order("created_at", { ascending: false })
      .range(0, 100);

    if (error) {
      console.error("Erreur lors du chargement des films :", error.message);
      return [];
    }

    return allMovies as Movie[];
  } else {
    // search par title
    const { data: moviesByTitle, error: titleError } = await supabase
      .from("movies")
      .select(
        `
        id, 
        title, 
        image_url, 
        release_date
      `
      )
      .ilike("title", `%${search}%`); // search by title (insensible à la casse)

    if (titleError) {
      console.error(
        "Erreur lors de la recherche par titre :",
        titleError.message
      );
      return [];
    }

    if (moviesByTitle && moviesByTitle.length > 0) {
      return moviesByTitle as Movie[];
    }

    return []; // no film found
  }
};

export const getMoviesByKeyword = async (search: string): Promise<Movie[]> => {
  if (search.trim() === "") {
    return []; // Pas de résultats si le champ est vide
  }

  const { data: keywords, error: keywordError } = await supabase
    .from("keywords")
    .select("id")
    .ilike("name", `%${search}%`); // Recherche par mot-clé insensible à la casse

  if (keywordError) {
    console.error(
      "Erreur lors de la recherche par mots-clés :",
      keywordError.message
    );
    return [];
  }

  if (keywords && keywords.length > 0) {
    const keywordIds = keywords.map((k) => k.id);

    // Recherche des films associés aux mots-clés
    const { data: movieKeywords, error: movieKeywordError } = await supabase
      .from("movie_keywords")
      .select("movie_id")
      .in("keyword_id", keywordIds);

    if (movieKeywordError) {
      console.error(
        "Erreur lors de la recherche des films par mots-clés :",
        movieKeywordError.message
      );
      return [];
    }

    const movieIds = movieKeywords.map((mk) => mk.movie_id);

    // Recherche des films par IDs associés aux mots-clés
    const { data: movies, error: movieError } = await supabase
      .from("movies")
      .select("id, title, image_url, release_date")
      .in("id", movieIds);

    if (movieError) {
      console.error(
        "Erreur lors de la récupération des films par ID :",
        movieError.message
      );
      return [];
    }

    return movies as Movie[];
  }

  return []; // Aucun film trouvé
};
