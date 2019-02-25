import React, { memo } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
interface ListItemProps {
  playCount: number;
  className?: string;
  picUrl: string;
  title: string;
  showCount?: boolean;
  onClick?: () => void;
}
const ListItem = memo((props: ListItemProps) => (
  <div
    onClick={props.onClick ? props.onClick : undefined}
    className={classNames(styles.listItem, props.className)}
  >
    <div className={styles.imgWrapper}>
      {props.showCount ? (
        <span className={styles.playCount}>{props.playCount}</span>
      ) : null}
      <img className={styles.img} src={props.picUrl} alt='' />
    </div>
    <h2 className={styles.title}>{props.title}</h2>
  </div>
));
export default ListItem;
