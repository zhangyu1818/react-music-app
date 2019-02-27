import React, { useEffect, useRef } from 'react';
import styles from './index.module.scss';
import BScroll from 'better-scroll';
import classNames from 'classnames';
import { useMyContext } from '../../context';
import { ADD_MUSIC } from '../../reducer/actionType';

const Item = (props: any) => (
  <div className={styles.listItem} onClick={props.onClick}>
    <div className={styles.index}>
      <i className={classNames('iconfont', { [styles.play]: props.isPlay })}>
        &#xe6c2;
      </i>
    </div>
    <div className={styles.info}>
      <span className={styles.name}>
        {props.track.name} {' - '}
      </span>
      <span className={styles.singer}>
        {props.track.ar.map((singer: any) => singer.name).join(' / ')}
      </span>
    </div>
  </div>
);

const PlayList = (props: any) => {
  const { state, dispatch } = useMyContext();
  const scrollEle = useRef<HTMLDivElement>(null);
  const scrollController = useRef<BScroll | null>(null);
  const scrollEnd = useRef(true);
  useEffect(() => {
    if (scrollEle.current) {
      scrollController.current = new BScroll(scrollEle.current, {
        bounce: {
          top: false
        },
        click: true
      });
    }
    return () => {
      scrollController.current && scrollController.current.destroy();
    };
  });
  const onTouchMask = (event: React.MouseEvent) => {
    event.stopPropagation();
    props.close();
  };
  const onChangeSong = (track: any) => {
    dispatch({ type: ADD_MUSIC, track });
  };
  return (
    <div
      style={{ display: props.isOpen ? 'block' : 'none' }}
      className={styles.playList}
      onClick={onTouchMask}
    >
      <div className={styles.list}>
        <div className={styles.inner} ref={scrollEle}>
          <div className={styles.scroll}>
            <div>
              {props.musicList.map((track: any) => (
                <Item
                  track={track}
                  key={track.id}
                  isPlay={state.currentId === track.id}
                  onClick={(event: React.MouseEvent) => {
                    event.stopPropagation();
                    onChangeSong(track);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlayList;
