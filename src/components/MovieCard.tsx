import { Movie } from "@/lib/tmdb";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  className?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function MovieCard({
  movie,
  className,
  isFavorite = false,
  onToggleFavorite,
}: MovieCardProps) {
  return (
    <Card
      className={cn(
        "group relative w-full aspect-[2/3] overflow-hidden bg-black",
        className,
      )}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = `https://via.placeholder.com/500x750?text=${encodeURIComponent(movie.title)}`;
        }}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.();
        }}
        className="absolute top-2 right-2 p-2 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/60 z-10"
      >
        <Heart
          className={`h-5 w-5 ${isFavorite ? "fill-current text-red-500" : "text-white"}`}
        />
      </button>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4">
        <h3 className="text-white font-bold">{movie.title}</h3>
        <p className="text-white/80 text-sm mt-2">
          {movie.overview.slice(0, 100)}...
        </p>
        <div className="absolute bottom-4 left-4">
          <p className="text-white text-sm">
            {new Date(movie.release_date).getFullYear()}
          </p>
          <p className="text-red-500 font-bold">
            {movie.vote_average.toFixed(1)}/10
          </p>
        </div>
      </div>
    </Card>
  );
}
