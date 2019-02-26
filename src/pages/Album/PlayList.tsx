import React, {
  createRef,
  PureComponent,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import BScroll from 'better-scroll';
import PlayListItem from './PlayListItem';
import { Link } from 'react-router-dom';
import { clamp } from 'lodash';
import Context from '../../context';
import { ADD_MUSIC, CHANGE_PLAY_LIST } from '../../reducer/actionType';
interface ResPlayList {
  coverImgUrl: string;
  playCount: number;
  name: string;
  creator: {
    avatarUrl: string;
    nickname: string;
  };
  tracks: any[];
  [propsName: string]: any;
}
interface PlayListState {
  opacity: number;
  playList: ResPlayList;
}
interface PlayListProps {
  onChange?: Function;
  [propName: string]: any;
}
class PlayList extends PureComponent<PlayListProps, any> {
  static contextType = Context;
  scrollEle = createRef<HTMLDivElement>();
  scrollController: BScroll | undefined;
  state = {
    opacity: 0,
    album: {
      blurPicUrl: '',
      artist: {
        picUrl: '',
        name: ''
      },
      playCount: 0,
      name: '',
      creator: {
        avatarUrl: '',
        nickname: ''
      },
      tracks: []
    },
    songs: []
  };
  componentDidMount() {
    const {
      onChange,
      location: { state },
      history
    } = this.props;
    if (!state) {
      history.push('/');
      return;
    }
    fetch(`/album?id=${state.id}`)
      .then((res) => res.json())
      .then((data) => {
        const { album, songs } = data;
        console.log(songs)
        this.setState({ album, songs }, () => {
          onChange &&
            onChange({
              picUrl: this.state.album.blurPicUrl,
              scale: 1
            });
        });
      });
    if (this.scrollEle.current) {
      this.scrollController = new BScroll(this.scrollEle.current, {
        probeType: 3,
        click: true
      });
      this.scrollController.on('scroll', ({ y }) => {
        y > 0 &&
          onChange &&
          onChange({
            picUrl: this.state.album.blurPicUrl,
            scale: 1 + y / 700
          });
        this.setState({ opacity: clamp(-y / 200, 0, 1) });
      });
    }
  }
  componentWillUnmount() {
    this.scrollController && this.scrollController.destroy();
  }

  playAll = () => {
    const { dispatch } = this.context;
    dispatch({
      type: CHANGE_PLAY_LIST,
      playList: this.state.songs
    });
  };
  onClickItem = (track: object) => {
    const { dispatch } = this.context;
    dispatch({
      type: ADD_MUSIC,
      track
    });
  };
  render() {
    const { album, songs, opacity } = this.state;
    return (
      <div className={styles.playList}>
        <div className={styles.header}>
          <Link to='/'>
            <i className={classNames('iconfont', styles.headerBackIcon)}>
              &#xe64b;
            </i>
          </Link>
          <div
            className={styles.headerNameWrapper}
            style={{ opacity: opacity }}
          >
            <p className={styles.headerName}>{album.name}</p>
          </div>
          <div className={styles.headerBg} style={{ opacity: opacity }} />
        </div>
        <div className={styles.scroll} ref={this.scrollEle}>
          <div style={{ willChange: 'transform' }}>
            <div className={styles.desc}>
              <div className={styles.imgWrapper}>
                <img
                  src={album.blurPicUrl}
                  alt=''
                  className={styles.coverImg}
                />
                <i className={classNames('iconfont', styles.listInfo)}>
                  &#xe6e5;
                </i>
              </div>
              <div className={styles.info}>
                <h1 className={styles.playListName}>{album.name}</h1>
                <div className={styles.creator}>
                  <img
                    src={album.artist.picUrl}
                    alt=''
                    className={styles.creatorAvatar}
                  />
                  <span className={styles.creatorName}>
                    {album.artist.name}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.list}>
              <div className={styles.playAll}>
                <button className={styles.playButton} onClick={this.playAll}>
                  播放全部
                </button>
                <span className={styles.total}>{songs.length}首</span>
              </div>
              {songs.map((track: any, index) => (
                <PlayListItem
                  onClick={() => this.onClickItem(track)}
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
  }
}

export default PlayList;
