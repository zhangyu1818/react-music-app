import React, { useContext, useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import Context from '../../context';

import ProgressBar from '../../components/Progress';
import Lyric from '../../components/Lyric';
import styles from './index.module.scss';
import { CHANGE_PLAY_STATE } from '../../reducer/actionType';

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
    state: { current, isPlay },
    dispatch
  } = useContext(Context);
  // 进度
  const [percent, setPercent] = useState(0);
  // 歌词
  const lyricController = useRef<any>(null);
  const [lyric, setLyric] = useState([]);
  // audio react.ref
  const audioRef = useRef<HTMLAudioElement>(null);
  // 播放时间
  const [timeline, setTimeline] = useState('0:00 / 0:00');
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
  // 当进度条改变时触发的事件
  const onProgressChange = (percent: number) => {
    (audioRef.current as HTMLAudioElement).currentTime =
      (percent / 100) * (audioRef.current as HTMLAudioElement).duration;
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
    isPlay ? audioRef.current.pause() : audioRef.current.play();
    dispatch({ type: CHANGE_PLAY_STATE, isPlay: !isPlay });
  };
  return (
    <div className={styles.playerWrapper}>
      {/*背景进度条*/}
      <div
        className={styles.backgroundProgress}
        style={{ transform: `translate3d(${percent}%,0,0)` }}
      />
      <div className={styles.topBar} />
      <div className={styles.controllerGroup}>
        <button className={styles.button}>
          <i className='iconfont'>&#xe624;</i>
        </button>
        <button className={styles.button}>
          <i className='iconfont'>&#xe609;</i>
        </button>
      </div>
      {/*歌曲封面*/}
      {/*<div className={styles.album}>*/}
      {/*<img className={styles.pic} src={current.picUrl} alt='' />*/}
      {/*</div>*/}
      <div className={styles.lyric}>
        <Lyric
          time={
            audioRef.current
              ? (audioRef.current as HTMLAudioElement).currentTime
              : 0
          }
        />
      </div>
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
        <button className={styles.button}>
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
      />
    </div>
  );
};

export default Player;
