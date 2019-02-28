import React, { useEffect, useRef } from 'react';
import styles from './index.module.scss';
import BScroll from 'better-scroll';
import classNames from 'classnames';
import { useMyContext } from '../../context';
import {
  ADD_MUSIC,
  CHANGE_LOOP_TYPE,
  DELETE_SONG,
  INIT_LIST
} from '../../reducer/actionType';
import { loopTypes } from '../../utils/types';

interface ItemProps {
  onClick?: (event: React.MouseEvent) => void;
  onClickDelete?: (event: React.MouseEvent) => void;
  current?: boolean;
  track: {
    name: string;
    ar: any[];
  };
}

interface dragDropContext {
  canDrag: boolean;
  dragStart: {
    pos: number;
    timeStamp: number;
  };
  dragMove: {
    pos: number;
    timeStamp: number;
  };
}

const Item = React.memo((props: ItemProps) => (
  <div
    className={classNames(styles.listItem, { [styles.current]: props.current })}
    onClick={props.onClick}
    data-current={props.current || null}
  >
    <div className={styles.info}>
      <span className={styles.name}>{props.track.name}</span>
      <span className={styles.singer}>
        {' - '}
        {props.track.ar.map((singer: any) => singer.name).join(' / ')}
      </span>
      <div className={styles.playIcon}>
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
    <div className={styles.delete} onClick={props.onClickDelete}>
      <i className='material-icons'>close</i>
    </div>
  </div>
));

const PlayList = (props: any) => {
  const { state, dispatch } = useMyContext({
    musicList() {
      scrollController.current && scrollController.current.refresh();
    }
  });
  const scrollEle = useRef<HTMLDivElement>(null);
  const scrollController = useRef<BScroll | null>(null);
  const dragDropContext = useRef<dragDropContext>({
    canDrag: false,
    dragStart: {
      pos: 0,
      timeStamp: 0
    },
    dragMove: {
      pos: 0,
      timeStamp: 0
    }
  });
  // 初始滚动列表
  useEffect(() => {
    if (scrollEle.current) {
      scrollController.current = new BScroll(scrollEle.current, {
        observeDOM: false,
        bounce: {
          top: false
        },
        click: true
      });
    }
    return () => {
      scrollController.current && scrollController.current.destroy();
    };
  }, []);
  // 每次打开后刷新列表,滚动到当前播放歌曲
  useEffect(
    () => {
      if (scrollController.current && props.isOpen) {
        scrollController.current.refresh();
        const currentELe = scrollEle.current!.querySelector('[data-current]');
        currentELe &&
          scrollController.current.scrollToElement(
            currentELe as HTMLDivElement,
            0,
            true,
            true
          );
      }
    },
    [props.isOpen]
  );
  const onTouchMask = (event: React.MouseEvent) => {
    event.stopPropagation();
    props.close();
  };
  const onChangeSong = (track: any) => {
    dispatch({ type: ADD_MUSIC, track });
  };
  const onClickDelete = (id: number) => {
    dispatch({ type: DELETE_SONG, songId: id });
  };
  const toggleLoopType = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch({ type: CHANGE_LOOP_TYPE, loopType: (state.loopType + 1) % 3 });
  };
  const deleteAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch({ type: INIT_LIST });
  };
  const onTouchStart = (event: React.TouchEvent) => {
    event.stopPropagation();
    const { touches } = event;
    const touch = touches[0];
    if (!scrollController.current) return;
    const y = scrollController.current.y;
    if (y) return;
    console.log(touch);
  };
  return (
    <div
      style={{ display: props.isOpen ? 'block' : 'none' }}
      className={styles.playList}
      onClick={onTouchMask}
    >
      <div
        className={styles.list}
        onClick={(event: React.MouseEvent) => event.stopPropagation()}
        onTouchStart={onTouchStart}
      >
        <div className={styles.topBar}>
          <div className={styles.loopType} onClick={toggleLoopType}>
            {state.loopType === loopTypes.order ? (
              <>
                <i className='material-icons'>repeat</i>
                <span>列表循环</span>
              </>
            ) : null}
            {state.loopType === loopTypes.shuffle ? (
              <>
                <i className='material-icons'>shuffle</i>
                <span> 随机播放</span>
              </>
            ) : null}
            {state.loopType === loopTypes.loop ? (
              <>
                <i className='material-icons'>repeat_one</i>
                <span>单曲循环</span>
              </>
            ) : null}
          </div>
          <div className={styles.delete} onClick={deleteAll}>
            <i className='material-icons'>delete_sweep</i>
          </div>
        </div>
        <div className={styles.inner} ref={scrollEle}>
          <div className={styles.scroll}>
            <div>
              {state.musicList.map((track: any) => (
                <Item
                  track={track}
                  key={track.id}
                  current={state.currentId === track.id}
                  onClick={(event: React.MouseEvent) => {
                    event.stopPropagation();
                    onChangeSong(track);
                  }}
                  onClickDelete={(event: React.MouseEvent) => {
                    event.stopPropagation();
                    onClickDelete(track.id);
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
