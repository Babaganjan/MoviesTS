// SearchMovie.tsx
import React, { useContext, useEffect, ChangeEvent } from 'react';
import debounce from 'debounce';
import { Alert } from 'antd';
import ContextWrapper from '../../context/ContextWrapper';
import { Movie } from '../../context/ContextProvider';
import './searchMovie.css';

// Типы для контекста
interface ContextProps {
  setMovies: (movies: Movie[]) => void;
  setGenresMap: (genres: Record<number, string>) => void;
  setQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const SearchMovie: React.FC = () => {
  const {
    setMovies,
    setGenresMap,
    setQuery,
    setLoading,
    error,
    setError,
  } = useContext(ContextWrapper) as ContextProps;

  useEffect(() => {
    const fetchGenres = async () => {
      const options: RequestInit = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNWY4NzcwNWNlYzYyZTA4YWNjZmY2NTRjMjJjZmJmZSIsIm5iZiI6MTczNjA2NjM0My4yODcwMDAyLCJzdWIiOiI2NzdhNDUyNzgyY2NlMTVhNzY3NGViOTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.IlVjxE4hOBNTPyyuWZQx2hOZB9DWHSmZFMcLveFZ8AU', // Ваш API токен
        },
      };

      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/genre/movie/list?language=en',
          options,
        );
        const data = await response.json();

        const genreDictionary: Record<number, string> = data.genres.reduce(
          (acc: Record<number, string>, genre: { id: number; name: string }) => {
            acc[genre.id] = genre.name;
            return acc;
          },
          {},
        );

        setGenresMap(genreDictionary);
      } catch (err) {
        setError(
          'Ошибка при загрузке жанров. Пожалуйста, проверьте подключение к интернету.',
        );
      }
    };
    fetchGenres();
  }, [setError, setGenresMap]);

  const fetchData = async (query: string) => {
    if (query) {
      setLoading(true);
      const options: RequestInit = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNWY4NzcwNWNlYzYyZTA4YWNjZmY2NTRjMjJjZmJmZSIsIm5iZiI6MTczNjA2NjM0My4yODcwMDAyLCJzdWIiOiI2NzdhNDUyNzgyY2NlMTVhNzY3NGViOTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.IlVjxE4hOBNTPyyuWZQx2hOZB9DWHSmZFMcLveFZ8AU',
        },
      };

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${query}`,
          options,
        );
        const data = await response.json();

        setMovies(data.results || []);
      } catch (err) {
        setError(
          'Ошибка при загрузке фильмов. Пожалуйста, проверьте подключение к интернету.',
        );
      } finally {
        setLoading(false);
      }
    } else {
      setMovies([]);
    }
  };

  // Типизируем debounce-функцию
  const debounceFetch = debounce((value: string) => {
    setQuery(value);
    fetchData(value);
  }, 1000);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    debounceFetch(newQuery);
  };

  return (
    <form className="input-field">
      <input
        type="text"
        className="search-movie"
        placeholder="Type to search..."
        onChange={handleChange}
      />
      {error && (
        <Alert className="error" message={error} type="error" showIcon />
      )}
    </form>
  );
};

export default SearchMovie;
