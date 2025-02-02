// // RatedComponent.tsx
import React, { useContext } from 'react';
import ContextWrapper from '../../context/ContextWrapper';
import MovieItem from '../movieItem/MovieItem';
import { PAGE_SIZE } from '../movieList/MoviesList';

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
  const {
    ratedMovies,
    currentPage,
  } = useContext(ContextWrapper) as {
    ratedMovies: RatedMovie[];
    currentPage: number;
  };

  const currentMovies = ratedMovies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main className="rated-movies">
      <ul className="movies-list">
        {ratedMovies.length > 0 ? (
          currentMovies.map((movie: RatedMovie) => (
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
    </main>
  );
};

export default RatedComponent;
