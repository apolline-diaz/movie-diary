// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { useRouter } from "next/navigation";
// import { z } from "zod";

// export default function EditListPage({ params }: { params: { id: string } }) {
//   const { id } = params;
//   const router = useRouter();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedMovies, setSelectedMovies] = useState<any[]>([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchListDetails = async () => {
//       try {
//         // Récupérer les données de la liste
//         const { data: list, error: listError } = await supabase
//           .from("lists")
//           .select("*")
//           .eq("id", id)
//           .single();

//         if (listError)
//           throw new Error("Erreur lors de la récupération de la liste.");

//         setTitle(list.title);
//         setDescription(list.description);

//         // Récupérer les films liés
//         const { data: movies, error: moviesError } = await supabase
//           .from("lists_movies")
//           .select("movie_id, movies(title)")
//           .eq("list_id", id);

//         console.log(movies);

//         if (moviesError)
//           throw new Error("Erreur lors de la récupération des films.");

//         setSelectedMovies(
//           movies
//             .filter((m) => m.movies && m.movies.title)
//             .map((m) => ({
//               id: m.movie_id,
//               title: m.movies.title,
//             }))
//         );
//       } catch (error: any) {
//         setError(error.message);
//       }
//     };

//     fetchListDetails();
//   }, [id]);

//   const schema = z.object({
//     title: z.string().min(1, "Le titre est obligatoire."),
//     description: z
//       .string()
//       .min(5, "La description doit contenir au moins 5 caractères."),
//     selectedMovies: z
//       .array(z.string())
//       .min(1, "Vous devez sélectionner au moins un film."),
//   });

//   const handleUpdateList = async () => {
//     setError("");

//     // Validation des champs
//     const validation = schema.safeParse({
//       title,
//       description,
//       selectedMovies: selectedMovies.map((movie) => movie.id),
//     });

//     if (!validation.success) {
//       setError("Veuillez remplir tous les champs correctement.");
//       return;
//     }

//     try {
//       // Mise à jour des informations de la liste
//       const { error: updateError } = await supabase
//         .from("lists")
//         .update({ title, description })
//         .eq("id", id);

//       if (updateError) {
//         throw new Error("Erreur lors de la mise à jour de la liste.");
//       }

//       // Mettre à jour les films liés (supprimer et réinsérer)
//       const { error: deleteError } = await supabase
//         .from("lists_movies")
//         .delete()
//         .eq("list_id", id);

//       if (deleteError) {
//         throw new Error("Erreur lors de la suppression des anciens films.");
//       }

//       const movieInsertData = selectedMovies.map((movie) => ({
//         list_id: id,
//         movie_id: movie.id,
//       }));

//       const { error: movieError } = await supabase
//         .from("lists_movies")
//         .insert(movieInsertData);

//       if (movieError) {
//         throw new Error("Erreur lors de l'ajout des nouveaux films.");
//       }

//       router.push(`/lists/${id}`);
//     } catch (err: any) {
//       setError(err.message || "Une erreur est survenue.");
//     }
//   };

//   const handleAddMovie = (movie: any) => {
//     if (!selectedMovies.find((m) => m.id === movie.id)) {
//       setSelectedMovies([...selectedMovies, movie]);
//     }
//   };

//   return (
//     <div className="p-10">
//       <h1 className="text-3xl font-bold mb-5">Modifier la liste</h1>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       <div className="mb-4">
//         <label
//           htmlFor="title"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Titre de la liste
//         </label>
//         <input
//           type="text"
//           id="title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="mt-2 block w-full border rounded p-2"
//         />
//       </div>

//       <div className="mb-4">
//         <label
//           htmlFor="description"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Description
//         </label>
//         <textarea
//           id="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="mt-2 block w-full border rounded p-2"
//         />
//       </div>

//       <div className="mb-4">
//         <label
//           htmlFor="movies"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Ajouter des films
//         </label>
//         <input
//           type="text"
//           id="movies"
//           placeholder="Recherchez un film"
//           className="mt-2 block w-full border rounded p-2"
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && e.currentTarget.value) {
//               const newMovie = {
//                 id: Math.random().toString(36).substr(2, 9),
//                 title: e.currentTarget.value,
//               };
//               handleAddMovie(newMovie);
//               e.currentTarget.value = "";
//             }
//           }}
//         />
//       </div>

//       <div className="mb-4">
//         <ul className="mt-2 space-y-2">
//           {selectedMovies.map((movie, idx) => (
//             <li
//               key={idx}
//               className="p-2 bg-gray-300 rounded flex items-center justify-between"
//             >
//               <span>{movie.title}</span>
//               <button
//                 type="button"
//                 className="text-red-500 hover:underline"
//                 onClick={() =>
//                   setSelectedMovies(
//                     selectedMovies.filter((_, index) => index !== idx)
//                   )
//                 }
//               >
//                 Supprimer
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="mt-8">
//         <button
//           type="button"
//           onClick={handleUpdateList}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Sauvegarder les modifications
//         </button>
//       </div>
//     </div>
//   );
// }
