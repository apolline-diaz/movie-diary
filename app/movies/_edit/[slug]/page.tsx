// "use client";
// import { SubmitButton } from "@/app/components/submit-button";
// import { createClient } from "@supabase/supabase-js";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Movie } from "@/app/types/movie"; // Importation du type Movie
// import { Country } from "@/app/types/country";
// import { Keyword } from "@/app/types/keyword";
// import { Director } from "@/app/types/director";

// export type Movie = {
//   id: string;
//   title: string;
//   description: string;
//   image_url: string;
//   release_date: string; // ou Date, selon votre logique
//   runtime: number;
//   directors: Director[];
//   genres: Genre[];
//   keywords: Keyword[];
//   countries: Country[];
// };

// export type Genre = {
//   id: string;
//   name: string;
//   created_at: number; // Assurez-vous que cette propriété est présente
// };

// export default function EditMoviePage({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );

//   const [country, setCOuntry] = useState<Country | null>(null);

//   const [movie, setMovie] = useState<Movie | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const [allKeywords, setAllKeywords] = useState<Keyword[]>([]);
//   const [selectedKeywords, setSelectedKeywords] = useState<Keyword[]>([]);
//   const [keywordInput, setKeywordInput] = useState("");

//   useEffect(() => {
//     const fetchMovieAndKeywords = async () => {
//       // Fetch movie data
//       const { data: movieData, error: movieError } = await supabase
//         .from("movies")
//         .select(
//           "id, title, description, image_url, release_date, runtime, directors(id, first_name, last_name), genres(id, name, created_at), keywords(id, name, created_at), countries(id, name)"
//         )
//         .eq("id", params.slug)
//         .single();

//       if (movieError) {
//         console.error(
//           "Erreur lors de la récupération du film:",
//           movieError.message
//         );
//         return;
//       }

//       setMovie(movieData);
//       setSelectedKeywords(movieData.keywords || []);
//       setLoading(false);

//       // Fetch keywords
//       const { data: keywordData, error: keywordError } = await supabase
//         .from("keywords")
//         .select("id, name, created_at"); // Inclure created_at

//       if (keywordError) {
//         console.error(
//           "Erreur lors de la récupération des mots-clés:",
//           keywordError.message
//         );
//       } else {
//         setAllKeywords(keywordData);
//       }
//     };

//     fetchMovieAndKeywords();
//   }, [params.slug]);

//   if (loading) {
//     return <div>Chargement...</div>;
//   }

//   if (!movie) {
//     return <div>Film introuvable</div>;
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const { error } = await supabase
//       .from("movies")
//       .update({
//         title: movie.title,
//         description: movie.description,
//         image_url: movie.image_url,
//         release_date: movie.release_date,
//         runtime: movie.runtime,
//       })
//       .eq("id", params.slug);

//     if (error) {
//       console.error("Erreur lors de la modification:", error.message);
//     } else {
//       // Mettre à jour les mots-clés si nécessaire
//       await supabase
//         .from("movie_keywords")
//         .delete()
//         .eq("movie_id", params.slug);

//       for (const keyword of selectedKeywords) {
//         await supabase
//           .from("movie_keywords")
//           .insert({ movie_id: params.slug, keyword_id: keyword.id });
//       }

//       router.push(`/movies/${params.slug}`);
//     }
//   };

//   const handleAddKeyword = (keyword: Keyword) => {
//     if (!selectedKeywords.find((k) => k.id === keyword.id)) {
//       setSelectedKeywords([...selectedKeywords, keyword]);
//     }
//     setKeywordInput("");
//   };

//   const handleRemoveKeyword = (id: string) => {
//     setSelectedKeywords(selectedKeywords.filter((k) => k.id !== id));
//   };

//   const filteredKeywords = allKeywords.filter(
//     (keyword) =>
//       keyword.name.toLowerCase().includes(keywordInput.toLowerCase()) &&
//       !selectedKeywords.find((k) => k.id === keyword.id)
//   );

//   return (
//     <div className="p-10">
//       <div className="tracking-wide text-xl mb-5">
//         Modifiez les informations
//       </div>
//       <form className="py-5" onSubmit={handleSubmit}>
//         <div className="w-full md:w-1/2 mb-6 md:mb-0">
//           <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
//             Titre :
//           </label>
//           <input
//             className="appearance-none block w-full bg-gray-200 text-gray-700 font-light border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//             type="text"
//             value={movie.title}
//             onChange={(e) => setMovie({ ...movie, title: e.target.value })}
//           />
//         </div>
//         <div className="w-full md:w-1/3 mb-6 mt-3 md:mb-0">
//           <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
//             Année de sortie :
//           </label>
//           <input
//             className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
//             type="text"
//             value={movie.release_date}
//             onChange={(e) =>
//               setMovie({ ...movie, release_date: e.target.value })
//             }
//           />
//         </div>
//         <div className="w-full md:w-1/2 mb-6 mt-3 md:mb-0">
//           <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
//             Synopsis :
//           </label>
//           <textarea
//             className="appearance-none block w-full bg-gray-200 text-gray-700 border font-light border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
//             value={movie.description}
//             onChange={(e) =>
//               setMovie({ ...movie, description: e.target.value })
//             }
//           />
//         </div>
//         <div className="w-full md:w-1/5 mb-6 mt-3 md:mb-0">
//           <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
//             Durée (en minutes) :
//           </label>
//           <input
//             className="appearance-none block w-full bg-gray-200 text-gray-700 border font-light capitalize border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
//             type="number"
//             value={movie.runtime}
//             onChange={(e) =>
//               setMovie({ ...movie, runtime: Number(e.target.value) })
//             }
//           />
//         </div>
//         <div className="w-full md:w-1/3 mt-3 mb-6 md:mb-0">
//           <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
//             Réalisateur :
//           </label>
//           <ul className="appearance-none block w-full bg-gray-200 text-gray-700  font-light capitalize border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">
//             {movie.directors.map((director) => (
//               <li key={director.id}>
//                 {director.first_name} {director.last_name}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="w-full md:w-1/3 mt-3 mb-6 md:mb-0">
//           <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
//             Genres :
//           </label>
//           <ul className="block appearance-none w-full font-light capitalize bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
//             {movie.genres.map((genre) => (
//               <li key={genre.id}>{genre.name}</li>
//             ))}
//           </ul>
//         </div>
//         <div className="w-full md:w-1/2 mt-3 mb-6 md:mb-0">
//           <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
//             Mots-clés :
//           </label>
//           <div>
//             <input
//               className="block appearance-none w-full bg-gray-200 text-gray-700 border py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
//               value={keywordInput}
//               onChange={(e) => setKeywordInput(e.target.value)}
//               placeholder="Tapez pour rechercher des mots-clés"
//             />
//             {keywordInput && filteredKeywords.length > 0 && (
//               <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 z-10">
//                 {filteredKeywords.map((keyword) => (
//                   <li
//                     key={keyword.id}
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-200"
//                     onClick={() => handleAddKeyword(keyword)}
//                   >
//                     {keyword.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//             <div className="mt-3">
//               {selectedKeywords.map((keyword) => (
//                 <span
//                   key={keyword.id}
//                   className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-light mr-2 px-2.5 py-0.5 rounded"
//                 >
//                   {keyword.name}
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveKeyword(keyword.id)}
//                     className="ml-2 text-red-500"
//                   >
//                     &times;
//                   </button>
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="w-full md:w-1/3 mt-3 mb-6 md:mb-0">
//           <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
//             Pays :
//           </label>
//           <ul className="appearance-none block w-full font-light capitalize bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">
//             {movie.countries.map((country) => (
//               <li key={country.id}>{country.name}</li>
//             ))}
//           </ul>
//         </div>
//         <SubmitButton />
//       </form>
//     </div>
//   );
// }
