// MoviesList.tsx
import React, { useContext } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import ContextWrapper from '../../context/ContextWrapper';
import { ContextValues } from '../../context/ContextProvider';
import MovieItem from '../movieItem/MovieItem';

import './moviesList.css';

export const PAGE_SIZE = 6;

// Определяем интерфейс для фильма
interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  overview: string;
}

const MoviesList: React.FC = () => {
  const { movies, genresMap, loading } = useContext(ContextWrapper) as ContextValues;

  return (
    <div className="movie-container">
      {loading ? (
        <Spin
          className="spin-loader"
          indicator={<LoadingOutlined spin />}
          size="large"
        />
      ) : (
        <main>
          {movies.length > 0 ? (
            <ul className="movies-list">
              {movies.slice(0, PAGE_SIZE).map((movie: Movie) => (
                <MovieItem
                  key={movie.id}
                  title={movie.title}
                  rating={movie.vote_average}
                  image={movie.poster_path}
                  releaseDate={movie.release_date}
                  genres={movie.genre_ids.map(
                    (id) => genresMap[id] || 'Unknown',
                  )}
                  descPrev={movie.overview}
                  movieId={movie.id}
                />
              ))}
            </ul>
          ) : (
            <p>No movies found</p>
          )}
        </main>
      )}
    </div>
  );
};

export default MoviesList;
