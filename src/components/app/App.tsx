// // // App.jsx
// import { useContext } from 'react';
// import PaginatedMovies from '../paginated/PaginatedMovies';
// import HeaderSwitcher from '../header/HeaderSwitcher';
// import MoviesList from '../movieList/MoviesList';
// import RatedComponent from '../ratedComponent/RatedComponent';
// import ContextWrapper from '../../context/ContextWrapper';
// import { ContextType } from '../../context/ContextProvider';
// import 'normalize.css';
// import './app.css';

// const App = () => {
//   const { activeOption } = useContext(ContextWrapper) as ContextType;

//   return (
//     <div className="container-layout">

// <HeaderSwitcher />
//       {activeOption === 'search' && (
//         <>
//           <MoviesList />
//           <PaginatedMovies tabType="search" />
//         </>
//       )}
//       {activeOption === 'rated' && (
//         <>
//           <RatedComponent />
//           <PaginatedMovies tabType="rated" />
//         </>
//       )}
//     </div>
//   );
// };

// export default App;

// App.tsx
import React, { useContext } from 'react';
import PaginatedMovies from '../paginated/PaginatedMovies';
import HeaderSwitcher from '../header/HeaderSwitcher';
import MoviesList from '../movieList/MoviesList';
import RatedComponent from '../ratedComponent/RatedComponent';
import ContextWrapper from '../../context/ContextWrapper';
import { ContextValues } from '../../context/ContextProvider';
import 'normalize.css';
import './app.css';

const App: React.FC = () => {
  const { activeOption } = useContext(ContextWrapper) as ContextValues;

  return (
    <div className="container-layout">
      <HeaderSwitcher />
      {activeOption === 'search' && (
        <>
          <MoviesList />
          <PaginatedMovies tabType="search" />
        </>
      )}
      {activeOption === 'rated' && (
        <>
          <RatedComponent />
          <PaginatedMovies tabType="rated" />
        </>
      )}
    </div>
  );
};

export default App;
