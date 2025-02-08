import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserFavorite = {
  id: number;
  user_id: string;
  movie_id: number;
  movie_data: any;
  created_at: string;
};

export const saveFavorite = async (userId: string, movie: any) => {
  const { data, error } = await supabase
    .from("favorites")
    .insert([{ user_id: userId, movie_id: movie.id, movie_data: movie }]);
  if (error) throw error;
  return data;
};

export const removeFavorite = async (userId: string, movieId: number) => {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .match({ user_id: userId, movie_id: movieId });
  if (error) throw error;
};

export const getFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data as UserFavorite[];
};
