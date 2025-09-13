import axios from 'axios';
import type { Movie } from '../types/movie';

export interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

const API_URL = 'https://api.themoviedb.org/3/search/movie';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (
  query: string,
  page = 1,
): Promise<FetchMoviesResponse> => {
  const response = await axios.get<FetchMoviesResponse>(API_URL, {
    params: { query, page },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
};
