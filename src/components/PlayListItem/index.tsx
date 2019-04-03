import React from "react";
import styles from "./index.module.scss";
import classNames from "classnames";

export interface PlayListItemProps {
  index: number;
  name: string;
  singer: string;
  onClick: () => void;
  current?: boolean;
  [propName: string]: any;
}
const PlayListItem = (props: PlayListItemProps) => {
  return (
    <div
      className={classNames(styles.listItem, {
        [styles.current]: props.current
      })}
      onClick={props.onClick}
    >
      <span className={styles.index}>{props.index}</span>
      <div className={styles.itemInfo}>
        <h2 className={styles.itemName}>{props.name}</h2>
        <p className={styles.itemSinger}>{props.singer}</p>
      </div>
    </div>
  );
};
export default PlayListItem;
