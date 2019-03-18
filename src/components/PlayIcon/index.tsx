import React from 'react';
import styles from './index.module.scss';
import ClassNames from 'classnames';

const PlayIcon = (props: { color?: string; className?: string,style?:any }) => (
  <div className={ClassNames(styles.playIcon, props.className || '')} style={props.style}>
    <i style={{ background: props.color }} />
    <i style={{ background: props.color }} />
    <i style={{ background: props.color }} />
    <i style={{ background: props.color }} />
  </div>
);
export default PlayIcon;
