import React, { createRef, PureComponent } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import BScroll from 'better-scroll';
import PlayListItem, { PlayListItemProps } from './PlayListItem';
import { Link } from 'react-router-dom';
import { clamp } from 'lodash';
import Context from '../../context';
import { CHANGE_PLAY_LIST } from '../../reducer/actionType';
interface PlayListState {
  [propName: string]: any;
}
interface PlayListProps {
  onChange?: Function;
  [propName: string]: any;
}
class PlayList extends PureComponent<PlayListProps, PlayListState> {
  static contextType = Context;
  scrollEle = createRef<HTMLDivElement>();
  scrollController: BScroll | undefined;
  state = {
    opacity: 0,
    playList: {
      coverImgUrl: '',
      playCount: 0,
      name: '',
      creator: {
        avatarUrl: '',
        nickname: ''
      },
      tracks: []
    }
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
    fetch(`/playlist/detail?id=${state.id}`)
      .then((res) => res.json())
      .then(({ playlist }) => {
        console.log(playlist);
        this.setState({ playList: playlist }, () => {
          onChange &&
            onChange({
              picUrl: this.state.playList.coverImgUrl,
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
        if (y > 0) {
          onChange &&
            onChange({
              picUrl: this.state.playList.coverImgUrl,
              scale: 1 + y / 700
            });
        }
        this.setState(() => ({ opacity: clamp(-y / 200, 0, 1) }));
      });
    }
  }
  playAll = () => {
    const { dispatch } = this.context;
    dispatch({
      type: CHANGE_PLAY_LIST,
      playList: this.state.playList.tracks
    });
  };
  render() {
    const { playList, opacity } = this.state;
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
            <p className={styles.headerName}>{playList.name}</p>
          </div>
          <div className={styles.headerBg} style={{ opacity: opacity }} />
        </div>
        <div className={styles.scroll} ref={this.scrollEle}>
          <div style={{ willChange: 'transform' }}>
            <div className={styles.desc}>
              <div className={styles.imgWrapper}>
                <span className={styles.playCount}>
                  <i className='iconfont'>&#xe6c2;</i>
                  {playList.playCount / 10000 > 1
                    ? ((playList.playCount / 10000) | 0) + '万'
                    : playList.playCount}
                </span>
                <img
                  src={playList.coverImgUrl}
                  alt=''
                  className={styles.coverImg}
                />
                <i className={classNames('iconfont', styles.listInfo)}>
                  &#xe6e5;
                </i>
              </div>
              <div className={styles.info}>
                <h1 className={styles.playListName}>{playList.name}</h1>
                <div className={styles.creator}>
                  <img
                    src={playList.creator.avatarUrl}
                    alt=''
                    className={styles.creatorAvatar}
                  />
                  <span className={styles.creatorName}>
                    {playList.creator.nickname}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.list}>
              <div className={styles.playAll}>
                <button className={styles.playButton} onClick={this.playAll}>
                  播放全部
                </button>
                <span className={styles.total}>{playList.tracks.length}首</span>
              </div>
              {playList.tracks.map((track: PlayListItemProps, index) => (
                <PlayListItem
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
