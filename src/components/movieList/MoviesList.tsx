// // MoviesList.tsx
// import { useContext } from 'react';
// import { Spin } from 'antd';
// import { LoadingOutlined } from '@ant-design/icons';
// import ContextWrapper from '../../context/ContextWrapper';
// import MovieItem from '../movieItem/MovieItem';
// import { Movie, GenresMap } from '../../context/ContextProvider';
// import './moviesList.css';

// const MoviesList = () => {
//   const { movies, genresMap, loading } = useContext(ContextWrapper) as {
//     movies: Movie[];
//     genresMap: GenresMap;
//     loading: boolean;
//   };

//   return (
//     <div className="movie-container">
//       {loading ? (
//         <Spin
//           className="spin-loader"
//           indicator={<LoadingOutlined spin />}
//           size="large"
//         />
//       ) : (
//         <main>
//           {movies.length > 0 ? (
//             <ul className="movies-list">
//               {movies.map((movie: Movie) => (
//                 <MovieItem
//                 key={movie.movieId}
//                 title={movie.title}
//                 rating={movie.rating}
//                 image={movie.image}
//                 releaseDate={movie.releaseDate}
//                 genres={movie.genres && Array.isArray(movie.genres) ?
//                   movie.genres.map(id => genresMap[id] || 'Unknown') : []}
//                 descPrev={movie.descPrev}
//                 movieId={movie.movieId}
//                 />
//               ))}
//             </ul>
//           ) : (
//             <p>No movies found</p>
//           )}
//         </main>
//       )}
//     </div>
//   );
// };

// export default MoviesList;

// MoviesList.tsx
import React, { useContext } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import ContextWrapper from '../../context/ContextWrapper';
import { ContextValues } from '../../context/ContextProvider';
import MovieItem from '../movieItem/MovieItem';

import './moviesList.css';

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
              {movies.map((movie: Movie) => (
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
