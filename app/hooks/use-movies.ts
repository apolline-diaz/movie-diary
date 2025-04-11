import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMoviesWithPagination } from "../server-actions/movies/search-movies-pagination";

// Types
export type MovieFilters = {
  title?: string;
  keyword?: string;
  director?: string;
  country?: string;
  genre?: string;
  year?: string;
  keywordIds?: number[];
  directorId?: bigint;
  countryId?: number;
  genreId?: bigint;
  releaseYear?: string;
  type?: string;
  page?: number;
  limit?: number;
};

export type Movie = {
  id: string;
  title: string;
  release_date: string | null;
  image_url?: string | null;
  description?: string | null;
  language?: string | null;
  runtime?: number | null;
  type?: string | null;
  boost?: boolean | null;
};

// Custom hook using useInfiniteQuery
export function useMovies(filters: MovieFilters = {}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["movies", filters],
    queryFn: async ({ pageParam }) => {
      return fetchMoviesWithPagination({
        ...filters,
        page: pageParam as number,
        limit: 20,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) {
        return undefined;
      }
      return allPages.length + 1;
    },
    // Cache configuration
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Extract and flatten movies from all pages
  const movies = data?.pages.flatMap((page) => page.movies) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  return {
    movies,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    refetch,
    isLoading,
  };
}
