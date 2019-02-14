import React, { useEffect, useRef, useState } from 'react';
import ProgressBar from './ProgressBar';

const Progress = () => {
  const [data, set] = useState('');
  const audioEle = useRef<null | HTMLAudioElement>(null);
  const onChange = (progress: any) => {
    const duration = (audioEle.current as HTMLAudioElement).duration;
    if(duration)
    (audioEle.current as HTMLAudioElement).currentTime = (duration * progress) / 100;
  };
  useEffect(() => {
    fetch('http://localhost:3001/song/url?id=187067')
      .then(res => res.json())
      .then(({ data }) => {
        set(data[0].url);
      });
  }, []);
  return (
    <>
      <audio src={data} controls ref={audioEle} />
      <ProgressBar onChange={onChange} />
    </>
  );
};
export default Progress;
