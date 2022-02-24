import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Searchbar from "../../components/searchbar/Searchbar"
import SquareCard from "../../components/squareCard/SquareCard";
import {
  clearGifList,
  fetchNext,
  searchGifs,
  selectGifList,
  selectIsLastPage,
  selectLoading,
  selectSearchTerm
} from "../../slices/gif/gifSlice";

import styles from './GifSearch.module.scss';

const Gifs = () => {
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading);
  const isPaginating = useRef<boolean>(false); // used to identify if the loading state is due to search or pagination
  const gifList = useSelector(selectGifList);
  const searchTerm = useSelector(selectSearchTerm);
  const isLastPage = useSelector(selectIsLastPage);

  const onSearch = useCallback((searchTerm: string) => {
    dispatch(clearGifList());
    dispatch(searchGifs(searchTerm));
  }, [dispatch]);

  const pauseOrPlayVideo = (e: React.MouseEvent<HTMLVideoElement> | React.TouchEvent<HTMLVideoElement>) => {
    if (e.type === 'mouseenter' || e.type === 'touchstart') {
      // @ts-ignore
      e.target?.play();
    } else if (e.type === 'mouseleave' || e.type === 'touchend') {
      // @ts-ignore
      e.target?.pause();
    }
  }

  const onScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    if (loading || isLastPage) return;
    const { clientHeight, scrollTop, scrollHeight } = e.target as HTMLDivElement;
    if ((scrollHeight - scrollTop - clientHeight) <= 25) {
      isPaginating.current = true;
      dispatch(fetchNext({ onEnd: () => isPaginating.current = false }));
    }
  }

  // initial fetch
  useEffect(() => {
    dispatch(searchGifs());
    return () => { dispatch(clearGifList()) };
  }, [dispatch]);

  const searchProvider = process.env.REACT_APP_API_PROVIDER;

  return (
    <div className={styles.container} onScroll={onScroll}>
      <div className={styles.navbar}>
        <Searchbar onSearch={onSearch} placeholder={searchProvider ? `Search is powered by ${searchProvider}` : 'Search...'} />
      </div>
      <div className={`container-fluid ${styles.gifsContainer}`}>
        <div className='row g-3'>
          {gifList.map(({ images, id }, i) => (
            <div className='col-md-2 col-sm-3 col-4' key={`${id}_${i}`}>
              <SquareCard>
                <video
                  onMouseEnter={pauseOrPlayVideo}
                  onMouseLeave={pauseOrPlayVideo}
                  onTouchStart={pauseOrPlayVideo}
                  onTouchEnd={pauseOrPlayVideo}
                  src={images?.original_mp4.mp4}
                  className='w-100 h-100'
                  loop
                  controls={false}
                />
              </SquareCard>
            </div>
          ))}
        </div>
      </div>
      {loading &&
        <div className={`py-3 ${isPaginating.current ? 'text-center' : styles.loaderCenter}`}>
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
      {!(loading || gifList.length) &&
        <div className={`${styles.message} px-3 text-center`}>
          {!searchTerm ? 'Search to see the results.' : 'No results Available. Try changing the search keyword.'}
        </div>
      }
    </div>
  );
}

export default Gifs;
