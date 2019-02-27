import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import BScroll from 'better-scroll';
import ListItem from '../../components/ListItem';
import { Link } from 'react-router-dom';
import { clamp } from 'lodash';
import { useMyContext } from '../../context';
import { ADD_MUSIC, CHANGE_PLAY_LIST } from '../../reducer/actionType';

interface PlayListState {
  coverImgUrl: string;
  playCount: number;
  name: string;
  creator: {
    avatarUrl: string;
    nickname: string;
  };
  tracks: any[];
}
interface PlayListProps {
  setBgImg?: Function;
  [propName: string]: any;
}
const initialState: PlayListState = {
  coverImgUrl: '',
  playCount: 0,
  name: '',
  creator: {
    avatarUrl: '',
    nickname: ''
  },
  tracks: []
};
const PlayList = (props: PlayListProps) => {
  const { dispatch } = useMyContext({
    playerSize() {
      scrollController.current && scrollController.current.refresh();
    }
  });
  const headerBg = useRef<HTMLDivElement | null>(null);
  const bgImg = useRef<HTMLDivElement | null>(null);
  const scrollEle = useRef<HTMLDivElement | null>(null);
  const scrollController = useRef<BScroll | null>(null);
  const [state, setState] = useState(initialState);
  useEffect(() => {
    const { setBgImg, location, history } = props;
    if (!location.state) {
      history.push('/');
      return;
    }
    fetch(`/playlist/detail?id=${location.state.id}`)
      .then((res) => res.json())
      .then(({ playlist }) => {
        setState({ ...state, ...playlist });
        setBgImg && setBgImg(playlist.coverImgUrl);
        if (scrollEle.current) {
          scrollController.current = new BScroll(scrollEle.current, {
            probeType: 3,
            observeDOM: false,
            click: true
          });
          scrollController.current.on('scroll', ({ y }) => {
            if (y > 0 && bgImg.current) {
              bgImg.current.style.transform = `scale(${1 + y / 700})`;
            }
            if (headerBg.current) {
              headerBg.current.style.opacity = `${clamp(-y / 250, 0, 1)}`;
            }
          });
        }
      });
    return () => {
      scrollController.current && scrollController.current.destroy();
    };
  }, []);
  const playAll = () => {
    dispatch({
      type: CHANGE_PLAY_LIST,
      playList: state.tracks
    });
  };
  const onClickItem = (track: object) => {
    dispatch({
      type: ADD_MUSIC,
      track
    });
  };
  return (
    <div className={styles.playList}>
      <div className={styles.header}>
        <Link to='/'>
          <i className={classNames('iconfont', styles.headerBackIcon)}>
            &#xe64b;
          </i>
        </Link>
        <div className={styles.headerBg} ref={headerBg}>
          <p className={styles.headerName}>{state.name}</p>
        </div>
      </div>
      <div className={styles.bgImg} ref={bgImg}>
        <img src={state.coverImgUrl} alt='' />
      </div>
      <div className={styles.scroll} ref={scrollEle}>
        <div style={{ willChange: 'transform' }}>
          <div className={styles.desc}>
            <div className={styles.imgWrapper}>
              <span className={styles.playCount}>
                <i className='iconfont'>&#xe6c2;</i>
                {state.playCount / 10000 > 1
                  ? ((state.playCount / 10000) | 0) + '万'
                  : state.playCount}
              </span>
              <img src={state.coverImgUrl} alt='' className={styles.coverImg} />
              <i className={classNames('iconfont', styles.listInfo)}>
                &#xe6e5;
              </i>
            </div>
            <div className={styles.info}>
              <h1 className={styles.playListName}>{state.name}</h1>
              <div className={styles.creator}>
                <img
                  src={state.creator.avatarUrl}
                  alt=''
                  className={styles.creatorAvatar}
                />
                <span className={styles.creatorName}>
                  {state.creator.nickname}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.list}>
            <div className={styles.playAll}>
              <button className={styles.playButton} onClick={playAll}>
                播放全部
              </button>
              <span className={styles.total}>{state.tracks.length}首</span>
            </div>
            {state.tracks.map((track: any, index: number) => (
              <ListItem
                onClick={() => {
                  onClickItem(track)
                }}
                key={track.id}
                index={index + 1}
                name={track.name}
                singer={track.ar.map((ar: any) => ar.name).join('/')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayList;
