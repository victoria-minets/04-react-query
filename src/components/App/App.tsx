import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

import css from './App.module.css';

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);

  // відповідь useQuery типізуємо в тій функції, яку їй передаємо.
  // В даному випадку - у fetchMovies

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', searchValue, page],
    queryFn: () => fetchMovies(searchValue, page),
    enabled: !!searchValue,
  });

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      toast.error('Please enter your search query.');
      return;
    }
    setSearchValue(value);
    setPage(1);
  };

  const movies = data?.results ?? [];

  useEffect(() => {
    if (!isLoading && searchValue && movies.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isLoading, searchValue, movies.length]);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
