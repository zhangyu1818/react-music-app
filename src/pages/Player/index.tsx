import React, { useContext, useRef, useState } from 'react';
import Context from '../../context';
import ProgressBar from '../../components/Progress';

const formatTime = (time: number) => {
  const min = (time / 60) | 0;
  const sec = ((time % 60 | 0) + '').padStart(2, '0');
  return `${min}:${sec}`;
};

const Player = () => {
  const {
    state: { current }
  } = useContext(Context);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [percent, setPercent] = useState(0);
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
  return (
    <div>
      <ProgressBar percent={percent} onChange={onProgressChange} />
      <audio
        controls
        src={current.url}
        ref={audioRef}
        onTimeUpdate={onAudioPlay}
      />
    </div>
  );
};

export default Player;
