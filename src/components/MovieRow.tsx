import { Movie } from "@/lib/tmdb";
import { MovieCard } from "./MovieCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export function MovieRow({ title, movies }: MovieRowProps) {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
