// // ContextProvider.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import ContextWrapper from './ContextWrapper';
import fetchSession from '../fetch-config/fetchSession';

export interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  overview: string;
}

export interface RatedMovie {
  movieId: number;
  title: string;
  rating: number;
  image: string;
  release_date: string;
  genres: string[];
  overview: string;
}

// Определяем интерфейс для значений, которые будут храниться в контексте
export interface ContextValues {
  guestSessionId: string | null;
  setGuestSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
  totalMovies: number;
  setTotalMovies: React.Dispatch<React.SetStateAction<number>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  genresMap: Record<number, string>;
  setGenresMap: (genresMap: Record<number, string>) => void;
  ratedMovies: RatedMovie[];
  setRatedMovies: React.Dispatch<React.SetStateAction<RatedMovie[]>>;
  activeOption: string;
  setActiveOption: (option: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
}

interface ContextProviderProps {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalMovies, setTotalMovies] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [genresMap, setGenresMap] = useState<Record<number, string>>({});
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [activeOption, setActiveOption] = useState<string>('search');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const createGuestSession = async () => {
      const sessionId = await fetchSession();
      if (sessionId) {
        setGuestSessionId(sessionId);
      }
    };
    createGuestSession();
  }, []);

  const contextValue: ContextValues = {
    guestSessionId,
    setGuestSessionId,
    movies,
    setMovies,
    totalMovies,
    setTotalMovies,
    query,
    setQuery,
    genresMap,
    setGenresMap,
    ratedMovies,
    setRatedMovies,
    activeOption,
    setActiveOption,
    loading,
    setLoading,
    error,
    setError,
  };

  return (
    <ContextWrapper.Provider value={contextValue}>
      {children}
    </ContextWrapper.Provider>
  );
};

export default ContextProvider;
