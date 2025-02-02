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
      const apiToken = import.meta.env.VITE_API_TOKEN;

      if (!localStorage.getItem('apiToken')) {
        localStorage.setItem('apiToken', apiToken);
      }

      // Проверяем, установлен ли токен
      if (!apiToken) {
        throw new Error('Токен недоступен: проверьте .env файл или переменные окружения');
      }

      const options: RequestInit = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiToken}`,
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

      const apiToken = import.meta.env.VITE_API_TOKEN;

      if (!localStorage.getItem('apiToken')) {
        localStorage.setItem('apiToken', apiToken);
      }

      // Проверяем, установлен ли токен
      if (!apiToken) {
        throw new Error('Токен недоступен: проверьте .env файл или переменные окружения');
      }

      const options: RequestInit = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiToken}`,
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
