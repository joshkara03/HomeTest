const API_KEY = "21004a11838a43392adcf9933a0748dc";
const BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export const tmdb = {
  async getPopularMovies(page = 1) {
    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`,
    );
    return res.json();
  },

  async searchMovies(query: string, page = 1) {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`,
    );
    return res.json();
  },

  async getGenres() {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    return res.json();
  },
};
