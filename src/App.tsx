import { useDispatch, useSelector } from 'react-redux';

import GifSearch from './container/gifSearch/GifSearch';
import { selectTheme, toggleTheme } from './slices/app/appSlice';

import styles from './App.module.scss';

function App() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  return (
    <div className={`${styles.appContainer} ${theme}-theme`}>
      <div className={styles.themeSelector} onClick={() => dispatch(toggleTheme(theme === 'light' ? 'dark' : 'light'))}>
        Toggle Theme
      </div>
      <GifSearch />
    </div>
  );
}

export default App;
