import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import BScroll from "better-scroll";
import ListItem from "../../components/PlayListItem";
import { Link } from "react-router-dom";
import { useMyContext } from "../../context";
import { ADD_MUSIC, CHANGE_PLAY_LIST } from "../../reducer/actionType";
import { clamp } from "lodash";
import axios from "axios";
import paramImg from "../../utils/paramImg";

interface PlayListState {
  album: {
    blurPicUrl: string;
    artist: {
      picUrl: string;
      name: string;
    };
    name: string;
  };
  songs: [];
  [propsName: string]: any;
}
interface PlayListProps {
  onChange?: Function;
  [propName: string]: any;
}
const initialState: PlayListState = {
  album: {
    blurPicUrl: '',
    artist: {
      picUrl: '',
      name: ''
    },
    name: ''
  },
  songs: []
};
const AlbumList = (props: PlayListProps) => {
  const {
    state: { currentId },
    dispatch
  } = useMyContext({
    playerSize() {
      scrollController.current && scrollController.current.refresh();
    }
  });
  const [albumState, setAlbumState] = useState(initialState);
  const scrollEle = useRef<HTMLDivElement>(null);
  const headerBg = useRef<HTMLDivElement>(null);
  const bgImg = useRef<HTMLDivElement>(null);
  const scrollController = useRef<BScroll | null>(null);
  useEffect(() => {
    const {
      location: { state },
      history
    } = props;
    if (!state) {
      history.push('/');
      return;
    }
    axios(`/album?id=${state.id}`).then(({ data }) => {
      const { album, songs } = data;
      setAlbumState({ ...albumState, album, songs });
      if (scrollEle.current) {
        scrollController.current = new BScroll(scrollEle.current, {
          probeType: 3,
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
      playList: albumState.songs
    });
  };
  const onClickItem = (track: object) => {
    dispatch({
      type: ADD_MUSIC,
      track
    });
  };
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <Link to='/'>
          <i className={classNames('material-icons', styles.headerBackIcon)}>
            arrow_back
          </i>
        </Link>
        <div className={styles.headerBg} ref={headerBg}>
          <p className={styles.headerName}>{albumState.album.name}</p>
        </div>
      </div>
      <div className={styles.bgImg} ref={bgImg}>
        <img
          src={
            albumState.album.blurPicUrl &&
            albumState.album.blurPicUrl + paramImg()
          }
          alt=''
        />
      </div>
      <div className={styles.scroll} ref={scrollEle}>
        <div style={{ willChange: 'transform', minHeight: '101%' }}>
          <div className={styles.desc}>
            <div className={styles.imgWrapper}>
              <img
                src={
                  albumState.album.blurPicUrl &&
                  albumState.album.blurPicUrl + paramImg(140)
                }
                alt=''
                className={styles.coverImg}
              />
              <i className={classNames('material-icons', styles.listInfo)}>
                &#xe88f;
              </i>
            </div>
            <div className={styles.info}>
              <h1 className={styles.playListName}>{albumState.album.name}</h1>
              <div className={styles.creator}>
                <img
                  src={
                    albumState.album.artist.picUrl &&
                    albumState.album.artist.picUrl + paramImg(36)
                  }
                  alt=''
                  className={styles.creatorAvatar}
                />
                <span className={styles.creatorName}>
                  {albumState.album.artist.name}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.list}>
            <div className={styles.playAll}>
              <button className={styles.playButton} onClick={playAll}>
                播放全部
              </button>
              <span className={styles.total}>{albumState.songs.length}首</span>
            </div>
            {albumState.songs.map((track: any, index) => (
              <ListItem
                onClick={() => onClickItem(track)}
                current={track.id === currentId}
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
export default AlbumList;
