// HeaderSwitcher.tsx
import { useContext } from 'react';
import SearchMovie from '../search/SearchMovie';
import ContextWrapper from '../../context/ContextWrapper';
import { ContextValues } from '../../context/ContextProvider';
import './headerSwitcher.css';

const HeaderSwitcher = () => {
  const { activeOption, setActiveOption } = useContext(ContextWrapper) as ContextValues;

  const handleOptionChange = (option: string) => {
    setActiveOption(option);
  };

  return (
    <header className="switcher-layout">
      <div className="switcher">
        <button
          className={`switcher-button ${activeOption === 'search' ? 'active' : ''}`}
          onClick={() => handleOptionChange('search')}
        >
          Search
        </button>
        <button
          className={`switcher-button ${activeOption === 'rated' ? 'active' : ''}`}
          onClick={() => handleOptionChange('rated')}
        >
          Rated
        </button>
        <div className={`slider ${activeOption}`} />
      </div>
      {activeOption === 'search' && <SearchMovie />}
    </header>
  );
};

export default HeaderSwitcher;
