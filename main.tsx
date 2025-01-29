// main.tsx
import ReactDOM from 'react-dom/client';
import App from './src/components/app/App';
import ContextProvider from './src/context/ContextProvider';

// Найдем элемент с идентификатором "root"
const rootElement = document.getElementById('root') as HTMLElement;

// Создаем корневой элемент React
const reactRoot = ReactDOM.createRoot(rootElement);

// Рендерим компоненты
reactRoot.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
);
