// // RatedComponent.tsx
import React, { useContext } from 'react';
import ContextWrapper from '../../context/ContextWrapper';
import { ContextValues } from '../../context/ContextProvider';
import MovieItem from '../movieItem/MovieItem';

// Определяем интерфейс для фильма в ratedMovies
interface RatedMovie {
  movieId: number;
  title: string;
  rating: number;
  image: string;
  release_date: string;
  genres: string[];
  overview: string;
}

const RatedComponent: React.FC = () => {
  const { ratedMovies } = useContext(ContextWrapper) as ContextValues;

  return (
    <div className="rated-movies">
      <ul className="movies-list">
        {ratedMovies.length > 0 ? (
          ratedMovies.map((movie: RatedMovie) => (
            <MovieItem
              key={movie.movieId}
              title={movie.title}
              rating={movie.rating}
              image={movie.image}
              releaseDate={movie.release_date}
              genres={movie.genres || []}
              descPrev={movie.overview}
              movieId={movie.movieId}
              isRated={true}
            />
          ))
        ) : (
          <p>No movies found</p>
        )}
      </ul>
    </div>
  );
};

export default RatedComponent;
