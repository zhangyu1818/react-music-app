import React, { useContext, useRef, useState } from 'react';
import classNames from 'classnames';
import Context from '../../context';

import ProgressBar from '../../components/Progress';
import styles from './index.module.scss';

const formatTime = (time: number) => {
  const min = (time / 60) | 0;
  const sec = ((time % 60 | 0) + '').padStart(2, '0');
  return `${min}:${sec}`;
};

const Player = () => {
  const {
    state: { current }
  } = useContext(Context);
  const [percent, setPercent] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioPlayState = useRef<boolean>(false);
  const [timeLine, setTimeLine] = useState('0:00/0:00');
  const onAudioPlay = () => {
    const temp =
      ((audioRef.current as HTMLAudioElement).currentTime /
        (audioRef.current as HTMLAudioElement).duration) *
      100;
    setPercent(isNaN(temp) ? 0 : temp);
    refreshTimeLine();
  };
  const onProgressChange = (percent: number) => {
    (audioRef.current as HTMLAudioElement).currentTime =
      (percent / 100) * (audioRef.current as HTMLAudioElement).duration;
  };
  const refreshTimeLine = () => {
    console.log(formatTime((audioRef.current as HTMLAudioElement).currentTime));
  };
  const togglePlayState = () => {
    if (!audioRef.current) return;
    audioPlayState.current ? audioRef.current.play() : audioRef.current.pause();
    audioPlayState.current = !audioPlayState.current;
  };
  return (
    <div className={styles.playerWrapper}>
      <div
        className={styles.backgroundProgress}
        style={{ width: `${percent}%` }}
      />
      <div className={styles.album}>
        <img className={styles.pic} src={current.picUrl} alt='' />
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.button}>上</button>
        <button
          className={classNames(styles.button, styles.actionButton)}
          onClick={togglePlayState}
        >
          停
        </button>
        <button className={styles.button}>下</button>
      </div>
      <div className={styles.songInfo}>
        <p className={styles.name}>{current.name}</p>
        <p className={styles.singerName}>{current.singerName}</p>
      </div>
      <ProgressBar
        percent={percent}
        onChange={onProgressChange}
        wrapperClassName={styles.progress}
      />
      <audio
        autoPlay
        src={current.url}
        ref={audioRef}
        onTimeUpdate={onAudioPlay}
      />
    </div>
  );
};

export default Player;
