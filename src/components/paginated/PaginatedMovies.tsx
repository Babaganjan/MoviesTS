// PaginatedMovies.tsx
import {
  useEffect, useContext, useCallback,
} from 'react';
import { Pagination } from 'antd';
import ContextWrapper from '../../context/ContextWrapper';
import { Movie, RatedMovie } from '../../context/ContextProvider';
import { PAGE_SIZE } from '../movieList/MoviesList';
import './paginatedMovies.css';

interface PaginatedMoviesProps {
  tabType: 'search' | 'rated';
}

const PaginatedMovies: React.FC<PaginatedMoviesProps> = ({ tabType }) => {
  const {
    totalMovies,
    setTotalMovies,
    query, setMovies,
    ratedMovies,
    currentPage,
    setCurrentPage,
  } = useContext(ContextWrapper) as {
    totalMovies: number;
    setTotalMovies: (total: number) => void;
    ratedMovies: RatedMovie[];
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    query: string;
    setMovies: (movies: Movie[]) => void;
  };

  // В зависимости от типа вкладки используем разные ключи в localStorage
  const localStorageKey = tabType === 'search' ? 'currentPage_search' : 'currentPage_rated';

  useEffect(() => {
    const savedPage = localStorage.getItem(localStorageKey);
    if (savedPage) {
      // Если есть сохраненная страница, устанавливаем текущую страницу в сохраненную
      setCurrentPage(JSON.parse(savedPage));
    } else if (tabType === 'rated') {
      // Если вкладка "Rated", сбрасываем на 1
      setCurrentPage(1);
    }
  }, [localStorageKey, setCurrentPage, tabType]);

  const fetchMovies = useCallback(async (searchQuery: string, page: number) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&page=${page}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('apiKey')}`,
          },
        },
      );

      const data = await response.json();
      const movies = data.results || [];
      const totalResults = data.total_results || 0;

      // Обрабатываем случай, когда получены пустые результаты
      if (totalResults === 0) {
        // Если нет фильмов, возвращаемся на 1 страницу
        setCurrentPage(1);
        setMovies([]); // Убираем фильмы из состояния
        setTotalMovies(0); // Обновляем общее количество
      } else {
        // Устанавливаем состояние фильмов и общее количество фильмов
        setMovies(movies);
        setTotalMovies(totalResults);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка при загрузке фильмов:', error);
    }
  }, [setCurrentPage, setMovies, setTotalMovies]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem(localStorageKey, JSON.stringify(page));

    fetchMovies(query, page);
  };

  useEffect(() => {
    if (query) {
      fetchMovies(query, currentPage);
    }
  }, [query, currentPage, fetchMovies]);

  const totalPages = Math.ceil(
    (tabType === 'rated' ? ratedMovies.length : totalMovies) / PAGE_SIZE,
  );

  return (
    <footer>
      <Pagination
        className="pagination"
        current={currentPage}
        total={totalPages * PAGE_SIZE}
        pageSize={PAGE_SIZE}
        onChange={handlePageChange}
      />
    </footer>
  );
};

export default PaginatedMovies;
