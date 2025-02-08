import { Movie } from "@/lib/tmdb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { MovieCard } from "./MovieCard";

interface FavoritesModalProps {
  favorites: Movie[];
  onRemoveFavorite: (movieId: number) => void;
}

export function FavoritesModal({
  favorites,
  onRemoveFavorite,
}: FavoritesModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-red-500"
        >
          <Heart className="h-6 w-6" />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>My Favorites ({favorites.length})</DialogTitle>
        </DialogHeader>
        {favorites.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">
            No favorite movies yet
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={true}
                onToggleFavorite={() => onRemoveFavorite(movie.id)}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
