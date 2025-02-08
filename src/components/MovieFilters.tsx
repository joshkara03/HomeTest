import { useEffect, useState } from "react";
import { Genre, tmdb } from "@/lib/tmdb";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface MovieFiltersProps {
  onFiltersChange: (filters: {
    rating: number;
    year: string;
    genres: number[];
  }) => void;
}

export function MovieFilters({ onFiltersChange }: MovieFiltersProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [rating, setRating] = useState(0);
  const [year, setYear] = useState("all");

  useEffect(() => {
    const fetchGenres = async () => {
      const data = await tmdb.getGenres();
      setGenres(data.genres);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    onFiltersChange({
      rating,
      year,
      genres: selectedGenres,
    });
  }, [rating, year, selectedGenres, onFiltersChange]);

  const years = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, i) => String(new Date().getFullYear() - i),
  );

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId],
    );
  };

  return (
    <div className="space-y-6 bg-zinc-900 p-4 rounded-lg">
      <div className="space-y-2">
        <label className="text-sm text-white">Rating ({rating}+)</label>
        <Slider
          value={[rating]}
          onValueChange={([value]) => setRating(value)}
          max={10}
          step={0.5}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white">Year</label>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-full bg-zinc-800 text-white border-none">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white">Genres</label>
        <ScrollArea className="h-[120px] w-full rounded-md border border-zinc-800 p-2">
          <div className="pr-4">
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant={
                    selectedGenres.includes(genre.id) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>

      {(rating > 0 || year !== "all" || selectedGenres.length > 0) && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setRating(0);
            setYear("all");
            setSelectedGenres([]);
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}
