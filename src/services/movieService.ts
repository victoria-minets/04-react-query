import axios from 'axios';
import type { Movie } from '../types/movie';

interface FetchMoviesResponse {
  results: Movie[];
}

const API_URL = 'https://api.themoviedb.org/3/search/movie';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (
  query: string,
): Promise<FetchMoviesResponse> => {
  const response = await axios.get<FetchMoviesResponse>(API_URL, {
    params: { query },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
};
