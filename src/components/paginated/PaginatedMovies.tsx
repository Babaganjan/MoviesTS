// PaginatedMovies.tsx
import {
  useEffect, useContext, useState, useCallback,
} from 'react';
import { Pagination } from 'antd';
import ContextWrapper from '../../context/ContextWrapper';
import { Movie } from '../../context/ContextProvider';
import './paginatedMovies.css';

interface PaginatedMoviesProps {
  tabType: 'search' | 'rated';
}

const PaginatedMovies: React.FC<PaginatedMoviesProps> = ({ tabType }) => {
  const {
    totalMovies, setTotalMovies, query, setMovies,
  } = useContext(ContextWrapper) as {
    totalMovies: number;
    setTotalMovies: (total: number) => void;
    query: string;
    setMovies: (movies: Movie[]) => void;
  };

  // В зависимости от типа вкладки используем разные ключи в localStorage
  const localStorageKey = tabType === 'search' ? 'currentPage_search' : 'currentPage_rated';

  const [currentPage, setCurrentPage] = useState<number>(() => {
    // Получаем страницу из localStorage, если она существует, иначе начинаем с 1
    const savedPage = localStorage.getItem(localStorageKey);
    return savedPage ? JSON.parse(savedPage) : 1;
  });

  const fetchMovies = useCallback(async (searchQuery: string, page: number) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&page=${page}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNWY4NzcwNWNlYzYyZTA4YWNjZmY2NTRjMjJjZmJmZSIsIm5iZiI6MTczNjA2NjM0My4yODcwMDAyLCJzdWIiOiI2NzdhNDUyNzgyY2NlMTVhNzY3NGViOTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.IlVjxE4hOBNTPyyuWZQx2hOZB9DWHSmZFMcLveFZ8AU',
          },
        },
      );

      const data = await response.json();
      setMovies(data.results || []);
      setTotalMovies(data.total_results || 0);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка при загрузке фильмов:', error);
    }
  }, [setMovies, setTotalMovies]);

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

  return (
    <footer>
      <Pagination
        className="pagination"
        current={currentPage}
        total={totalMovies}
        onChange={handlePageChange}
      />
    </footer>
  );
};

export default PaginatedMovies;
