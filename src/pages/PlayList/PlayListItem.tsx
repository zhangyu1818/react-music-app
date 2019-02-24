import React from 'react';
import styles from './index.module.scss';
export interface PlayListItemProps {
  index: number;
  name: string;
  singer: string;
  [propName: string]: any;
}
const PlayListItem = (props: PlayListItemProps) => {
  return (
    <div className={styles.listItem}>
      <span className={styles.index}>{props.index}</span>
      <div className={styles.itemInfo}>
        <h2 className={styles.itemName}>{props.name}</h2>
        <p className={styles.itemSinger}>{props.singer}</p>
      </div>
    </div>
  );
};
export default PlayListItem;
