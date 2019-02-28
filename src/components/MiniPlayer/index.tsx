import React, { useRef, useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import { useMyContext } from '../../context';
import PlayList from '../../components/PlayList';
import {
  CHANGE_PLAY_STATE,
  CHANGE_PLAYER_SIZE
} from '../../reducer/actionType';
import { playerSizeType } from '../../utils/types';

const MiniPlayer = () => {
  const { state, dispatch } = useMyContext({
    loading() {
      const {
        width: parentWidth
      } = titleRef.current!.parentElement!.getBoundingClientRect();
      const { width } = titleRef.current!.getBoundingClientRect();
      if (parentWidth > width) {
        titleRef.current!.style.width = `max-content`;
        titleRef.current!.style.animation = '';
      } else {
        titleRef.current!.style.width = `${width - parentWidth}px`;
        titleRef.current!.style.animation = `scroll 5s linear alternate infinite`;
      }
    }
  });
  const titleRef = useRef<HTMLDivElement>(null);
  const [listState, setListState] = useState(false);
  const togglePlayState = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch({ type: CHANGE_PLAY_STATE, isPlay: !state.isPlay });
  };
  const togglePlayList = (event: React.MouseEvent) => {
    event.stopPropagation();
    setListState(true);
  };
  const onOpenPlayer = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch({ type: CHANGE_PLAYER_SIZE, size: playerSizeType.normal });
  };
  const display =
    !state.showPlayer || state.playerSize === playerSizeType.normal
      ? 'none'
      : 'flex';
  return (
    <div
      className={styles.miniPlayer}
      style={{ display }}
      onClick={onOpenPlayer}
    >
      <img
        className={classNames(styles.miniPic, { [styles.stop]: !state.isPlay })}
        src={state.current.picUrl}
        alt=''
      />
      <div className={styles.songInfo}>
        <div className={styles.scrollTitle} ref={titleRef}>
          <p className={styles.name}>{state.current.name}</p>
        </div>
        <p className={styles.singer}>{state.current.singerName}</p>
      </div>
      <div className={styles.playControl} onClick={togglePlayState}>
        {state.isPlay ? (
          <i className='material-icons'>pause</i>
        ) : (
          <i className='material-icons'>play_arrow</i>
        )}
      </div>
      <div className={styles.playControl} onClick={togglePlayList}>
        <i className={classNames('material-icons', styles.list)}>queue_music</i>
      </div>
      <PlayList isOpen={listState} close={() => setListState(false)} />
    </div>
  );
};

export default MiniPlayer;
