import React, { useContext } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import Context from '../../context';
import {
  CHANGE_PLAY_STATE,
  CHANGE_PLAYER_SIZE
} from '../../reducer/actionType';
import { playerSizeType } from '../../utils/types';
import ScrollTitle from '../ScrollTitle';

const MiniPlayer = () => {
  const { state, dispatch } = useContext(Context);
  const togglePlayState = (event: React.TouchEvent) => {
    event.stopPropagation();
    dispatch({ type: CHANGE_PLAY_STATE, isPlay: !state.isPlay });
  };
  const onOpenPlayer = () => {
    dispatch({ type: CHANGE_PLAYER_SIZE, size: playerSizeType.normal });
  };
  // if (!state.showPlayer || state.playerSize === playerSizeType.normal)
  //   return null;
  return (
    <div className={styles.miniPlayer} onTouchStart={onOpenPlayer}>
      <img
        className={classNames(styles.miniPic, { [styles.stop]: !state.isPlay })}
        src={state.current.picUrl}
        alt=''
      />
      <div className={styles.playControl} onTouchStart={togglePlayState}>
        {state.isPlay ? (
          <i className='iconfont'>&#xe64d;</i>
        ) : (
          <i className='iconfont'>&#xe770;</i>
        )}
      </div>
      <div className={styles.songInfo}>
        <ScrollTitle>
          <p className={styles.name}>{state.current.name}</p>
          {' - '}
          <p className={styles.singer}>{state.current.singerName}</p>
        </ScrollTitle>
      </div>
    </div>
  );
};

export default MiniPlayer;
