// MovieItem.tsx
import React, {
  useContext, useState, useEffect, useCallback,
} from 'react';
import { Rate } from 'antd';
import ContextWrapper from '../../context/ContextWrapper';
import { ContextValues, RatedMovie } from '../../context/ContextProvider';
import './movieItem.css';

// Определяем интерфейс для пропсов компонента MovieItem
interface MovieItemProps {
  title: string;
  rating: number;
  image: string;
  releaseDate: string;
  genres: string[];
  descPrev: string;
  movieId: number;
  isRated?: boolean;
}

const MovieItem: React.FC<MovieItemProps> = ({
  title,
  rating,
  image,
  releaseDate,
  genres,
  descPrev,
  movieId,
}) => {
  const context = useContext(ContextWrapper) as ContextValues;
  const { ratedMovies, guestSessionId, setRatedMovies } = context;

  const imageUrl = `https://image.tmdb.org/t/p/w500${image}`;

  const getRatingClass = (newRating: number): string => {
    if (newRating < 3) return 'low-rating';
    if (newRating < 5) return 'medium-low-rating';
    if (newRating < 7) return 'medium-rating';
    return 'high-rating';
  };

  const [userRating, setUserRating] = useState<number>(rating);
  const [ratingClass, setRatingClass] = useState<string>(getRatingClass(rating));
  const [isRated, setIsRated] = useState<boolean>(false);

  const saveRatingToLocalStorage = (
    movieToStorageId: number,
    ratingToStorage: number,
    isRatedToStorage: boolean,
  ): void => {
    const ratings: Record<number, { rating: number; isRated: boolean }> = JSON.parse(localStorage.getItem('ratings') || '{}');
    ratings[movieToStorageId] = { rating: ratingToStorage, isRated: isRatedToStorage };
    localStorage.setItem('ratings', JSON.stringify(ratings));
  };

  const getRatingFromLocalStorage = useCallback((movieGetStorageId: number):
  { rating: number; isRated: boolean } => {
    const ratings = JSON.parse(localStorage.getItem('ratings') || '{}');
    return ratings[movieGetStorageId] || { rating, isRated: false };
  }, [rating]);
  //
  useEffect(() => {
    const savedData = getRatingFromLocalStorage(movieId);
    setUserRating(savedData.rating);
    setIsRated(savedData.isRated);
  }, [movieId, getRatingFromLocalStorage]);

  const checkIfRated = (): boolean => ratedMovies.some((movie) => movie.movieId === movieId);

  const roundToTenths = (num: number): number => Math.round(num * 10) / 10;

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const formattedDate = formatDate(releaseDate);

  const handleRatingChange = async (newRating: number): Promise<void> => {
    setUserRating(newRating);
    setRatingClass(getRatingClass(newRating));

    if (!checkIfRated()) {
      if (guestSessionId) {
        const apiToken = import.meta.env.VITE_API_TOKEN;

        if (!localStorage.getItem('apiToken')) {
          localStorage.setItem('apiToken', apiToken);
        }

        // Проверяем, установлен ли токен
        if (!apiToken) {
          throw new Error('Токен недоступен: проверьте .env файл или переменные окружения');
        }

        const options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            media_type: 'movie',
            media_id: movieId,
            value: newRating,
          }),
        };

        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${guestSessionId}`,
            options,
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `Ошибка при отправке оценки! Код: ${response.status}, Сообщение: ${errorData.message}`,
            );
          }

          saveRatingToLocalStorage(movieId, newRating, true);
          setIsRated(true);

          if (newRating > 0) {
            setRatedMovies((prev: RatedMovie[]): RatedMovie[] => {
              const existingMovie = prev.find((movie: RatedMovie) => movie.movieId === movieId);
              if (existingMovie) {
                return prev.map((movie: RatedMovie) => (
                  movie.movieId === movieId ? { ...movie, rating: newRating } : movie
                ));
              }
              return [
                ...prev,
                {
                  title,
                  rating: newRating,
                  image,
                  release_date: releaseDate,
                  genres,
                  overview: descPrev,
                  movieId,
                },
              ];
            });
          } else {
            setRatedMovies((prev: RatedMovie[]): RatedMovie[] => (
              prev.filter((movie: RatedMovie) => movie.movieId !== movieId)
            ));
          }
        } catch (error) {
          throw new Error(`Произошла ошибка при отправке рейтинга: ${error}`);
        }
      }
    }
  };

  return (
    <li className="movie-item">
      <img className="poster poster-big-hidden" src={imageUrl} alt={title} />
      <div className="movie-content">
      <div className='movie-layout-mobil'>
      <img className="poster-hidden" src={imageUrl} alt={title} />
        <div className='movie-item-mobil'>
        <div className="wrapper-title">
          <h2 className="title">{title}</h2>
          <span className={`rating ${ratingClass}`}>
            {roundToTenths(userRating)}
          </span>
        </div>
        <span className="movie-release">{formattedDate}</span>
        <div className="genres">
          {genres.map((genre, index) => (
            <span key={index} className="genre">
              {genre}
            </span>
          ))}
        </div>
        </div>
      </div>
        <div className='movie-desc-block'>
        <p className="movie-desc">{descPrev}</p>
        <Rate
          count={10}
          value={isRated ? userRating : 0}
          onChange={handleRatingChange}
          disabled={isRated}
        />
        </div>
      </div>
    </li>
  );
};

export default MovieItem;
