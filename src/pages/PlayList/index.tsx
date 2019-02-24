import React, { useState } from 'react';
import PlayList from './PlayList';
import styles from './index.module.scss';
const PlayListWrapper = () => {
  const [state, setState] = useState({ picUrl: '', scale: 1 });
  return (
    <div className={styles.playListWrapper}>
      <div className={styles.bgImg}>
        <img
          className={styles.img}
          src={state.picUrl}
          style={{
            transform: `scale(${state.scale})`
          }}
          alt=''
        />
      </div>
      <PlayList onChange={setState} />
    </div>
  );
};
export default PlayListWrapper;
