import React from 'react';
import ProgressBar from '../../components/Progress';

const Player = (props: any) => {
  return (
    <div>
      <ProgressBar percent={0} />
      <audio controls src={props.url} />
    </div>
  );
};

export default Player;
