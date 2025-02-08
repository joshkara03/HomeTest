import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { getFavorites, saveFavorite, removeFavorite } from "@/lib/supabase";
import { Movie, tmdb } from "@/lib/tmdb";
import { MovieCard } from "./MovieCard";
import { MovieFilters } from "./MovieFilters";
import { Input } from "./ui/input";
import { FavoritesModal } from "./FavoritesModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function Home() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getFavorites(user.id).then((favs) => {
        setFavorites(favs.map((f) => f.movie_data));
      });
    } else {
      setFavorites([]);
    }
  }, [user]);

  const toggleFavorite = async (movie: Movie) => {
    if (!user) return;

    try {
      if (favorites.some((m) => m.id === movie.id)) {
        await removeFavorite(user.id, movie.id);
        setFavorites((prev) => prev.filter((m) => m.id !== movie.id));
      } else {
        await saveFavorite(user.id, movie);
        setFavorites((prev) => [...prev, movie]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleRemoveFavorite = async (movieId: number) => {
    if (!user) return;

    try {
      await removeFavorite(user.id, movieId);
      setFavorites((prev) => prev.filter((m) => m.id !== movieId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    rating: 0,
    year: "all",
    genres: [] as number[],
  });
  const observer = useRef<IntersectionObserver>();

  const lastMovieElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const fetchMovies = async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await (searchQuery.trim()
        ? tmdb.searchMovies(searchQuery, pageNum)
        : tmdb.getPopularMovies(pageNum));

      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchMovies(1);
  }, [searchQuery]);

  useEffect(() => {
    if (page > 1) {
      fetchMovies(page);
    }
  }, [page]);

  const filteredMovies = [...movies].filter((movie) => {
    if (filters.rating > 0 && movie.vote_average < filters.rating) {
      return false;
    }
    if (
      filters.year !== "all" &&
      new Date(movie.release_date).getFullYear().toString() !== filters.year
    ) {
      return false;
    }
    if (
      filters.genres.length > 0 &&
      !filters.genres.some((genreId) => movie.genre_ids.includes(genreId))
    ) {
      return false;
    }
    return true;
  });

  const sortedMovies = filteredMovies.sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      );
    }
    return (
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );
  });

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex gap-4 items-center sticky top-8 z-10 bg-black/80 backdrop-blur-sm p-4 -mx-4">
          <div className="flex-1">
            <Input
              className="bg-zinc-800 text-white border-none w-full"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-zinc-800 text-white border-none">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          <AuthModal />
          {user && (
            <FavoritesModal
              favorites={favorites}
              onRemoveFavorite={handleRemoveFavorite}
            />
          )}
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <div className="sticky top-32">
              <MovieFilters onFiltersChange={setFilters} />
            </div>
          </div>

          <div className="col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  ref={
                    index === sortedMovies.length - 1
                      ? lastMovieElementRef
                      : undefined
                  }
                >
                  <MovieCard
                    movie={movie}
                    isFavorite={favorites.some((f) => f.id === movie.id)}
                    onToggleFavorite={() => toggleFavorite(movie)}
                  />
                </div>
              ))}
            </div>

            {loading && (
              <div className="text-white text-center py-4">
                Loading more movies...
              </div>
            )}

            {!loading && sortedMovies.length === 0 && (
              <div className="text-white text-center py-4">
                No movies found matching your criteria
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
