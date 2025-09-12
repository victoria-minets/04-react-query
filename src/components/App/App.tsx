import { useState } from 'react';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

import toast, { Toaster } from 'react-hot-toast';

import css from './App.module.css';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (searchValue: string) => {
    try {
      setError(false);
      setIsLoading(true);
      const data = await fetchMovies(searchValue);
      if (data.results.length === 0) {
        toast.error('No movies found for your request.');
        setMovies([]);
        return;
      }
      setMovies(data.results);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <div className={css.app}>
        <SearchBar onSubmit={handleSearch} />
        <Toaster position="top-center" />

        {isLoading && <Loader />}
        {error && <ErrorMessage />}

        {!isLoading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        )}

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </div>
    </>
  );
}
