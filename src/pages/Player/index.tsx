import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Context from '../../context';

import ProgressBar from '../../components/Progress';
import Lyric from '../../components/Lyric';
import styles from './index.module.scss';
import {
  CHANGE_CURRENT_SONG,
  CHANGE_PLAY_STATE,
  CHANGE_PLAYER_SIZE,
  NEXT_SONG,
  SHOW_PLAYER
} from '../../reducer/actionType';
import Tabs, { TabPane } from '../../components/Tabs';
import { fetchSong } from '../../utils/song';
import { playerSizeType } from '../../utils/types';

/**
 * 格式化时间
 * @param time
 */
const formatTime = (time: number) => {
  const min = (time / 60) | 0;
  const sec = ((time % 60 | 0) + '').padStart(2, '0');
  return `${min}:${sec}`;
};

const Player = () => {
  // context
  const {
    state: { current, isPlay, currentId, showPlayer, playerSize },
    dispatch
  } = useContext(Context);
  // 进度
  const [percent, setPercent] = useState(0);
  const [dragProgress, setDragProgress] = useState(false);
  // audio react.ref
  const audioRef = useRef<HTMLAudioElement>(null);
  // 播放时间
  const [timeline, setTimeline] = useState('0:00 / 0:00');
  // 缩小
  const zoomOut = () => {
    dispatch({ type: CHANGE_PLAYER_SIZE, size: playerSizeType.mini });
  };
  // 当audio标签可以播放时触发事件
  const onCanPlay = () => {
    if (!audioRef.current) return;
    (audioRef.current as HTMLAudioElement).play();
    const paused = (audioRef.current as HTMLAudioElement).paused;
    dispatch({ type: CHANGE_PLAY_STATE, isPlay: !paused });
    refreshTimeline();
  };
  // 当audio标签播放时触发事件
  const onAudioPlay = () => {
    const temp =
      ((audioRef.current as HTMLAudioElement).currentTime /
        (audioRef.current as HTMLAudioElement).duration) *
      100;
    setPercent(isNaN(temp) ? 0 : temp);
    refreshTimeline();
  };
  // 播放完
  const onEnd = () => {
    dispatch({ type: NEXT_SONG });
  };
  // 当进度条改变时触发的事件
  const onProgressChange = (percent: number) => {
    (audioRef.current as HTMLAudioElement).currentTime =
      (percent / 100) * (audioRef.current as HTMLAudioElement).duration;
    setDragProgress(true);
  };
  // 手动改变进度条传入进度给歌词
  const lyricChange = (): undefined | number => {
    if (!dragProgress) return;
    setDragProgress(false);
    return audioRef.current
      ? (audioRef.current as HTMLAudioElement).currentTime
      : 0;
  };
  // 刷新歌曲时间显示
  const refreshTimeline = () => {
    const timeline = `${formatTime(
      (audioRef.current as HTMLAudioElement).currentTime
    )} / ${formatTime((audioRef.current as HTMLAudioElement).duration)}`;
    setTimeline(timeline);
  };
  // 切换播放状态
  const togglePlayState = () => {
    if (!audioRef.current) return;
    dispatch({ type: CHANGE_PLAY_STATE, isPlay: !isPlay });
  };
  const nextSong = () => {
    dispatch({ type: NEXT_SONG });
  };
  useEffect(() => {
    if (currentId !== undefined) {
      !showPlayer && dispatch({ type: SHOW_PLAYER });
      fetchSong(currentId).then((current) => {
        console.log(current);
        dispatch({ type: CHANGE_CURRENT_SONG, payload: current });
      });
    }
  }, [currentId]);
  useEffect(() => {
    if (!audioRef.current) return;
    isPlay ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlay]);
  return (
    <div
      className={classNames(styles.playerWrapper, {
        [styles.show]: showPlayer && playerSize === playerSizeType.normal
      })}
    >
      {/*背景进度条*/}
      <div
        className={styles.backgroundProgress}
        style={{ transform: `translate3d(${percent}%,0,0)` }}
      />
      <div className={styles.topBar}>
        <div className={styles.back} onClick={zoomOut}>
          <i className={classNames('iconfont', styles.icon)}>&#xe600;</i>
        </div>
      </div>
      <div className={styles.controllerGroup}>
        <button className={styles.button}>
          <i className='iconfont'>&#xe624;</i>
        </button>
        <button className={styles.button}>
          <i className='iconfont'>&#xe609;</i>
        </button>
      </div>
      {/*歌曲封面*/}
      <Tabs className={styles.tabs}>
        <TabPane>
          <div className={styles.album}>
            <img className={styles.pic} src={current.picUrl} alt='' />
          </div>
        </TabPane>
        <TabPane>
          <div className={styles.lyric}>
            <Lyric progressChange={lyricChange} />
          </div>
        </TabPane>
      </Tabs>
      {/*歌曲控制组*/}
      <div className={styles.buttonGroup}>
        <button className={styles.button}>
          <i className='iconfont'>&#xe76e;</i>
        </button>
        <button
          className={classNames(styles.button, styles.actionButton)}
          onClick={togglePlayState}
        >
          {isPlay ? (
            <i className='iconfont'>&#xe64d;</i>
          ) : (
            <i className='iconfont'>&#xe770;</i>
          )}
        </button>
        <button className={styles.button} onClick={nextSong}>
          <i className='iconfont'>&#xe76d;</i>
        </button>
      </div>
      {/*歌曲、歌手名称*/}
      <div className={styles.songInfo}>
        <p className={styles.name}>{current.name}</p>
        <p className={styles.singerName}>{current.singerName}</p>
      </div>
      {/*进度条*/}
      <ProgressBar
        percent={percent}
        onChange={onProgressChange}
        wrapperClassName={styles.progress}
      />
      <p className={styles.timeline}>{timeline}</p>
      <audio
        autoPlay
        src={current.url}
        ref={audioRef}
        onCanPlay={onCanPlay}
        onTimeUpdate={onAudioPlay}
        onEnded={onEnd}
      />
    </div>
  );
};

export default Player;
