import React, { memo } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
interface ListItemProps {
  playCount?: number;
  className?: string;
  picUrl: string;
  title: string;
  onClick?: () => void;
}
const ListItem = memo((props: ListItemProps) => (
  <div
    onClick={props.onClick ? props.onClick : undefined}
    className={classNames(styles.listItem, props.className)}
  >
    <div className={styles.imgWrapper}>
      {props.playCount ? (
        <span className={styles.playCount}>
          <i className='iconfont'>&#xe6c2;</i>
          {props.playCount / 10000 > 1
            ? ((props.playCount / 10000) | 0) + '万'
            : props.playCount}
        </span>
      ) : null}
      <img className={styles.img} src={props.picUrl} alt='' />
    </div>
    <h2 className={styles.title}>{props.title}</h2>
  </div>
));
export default ListItem;
