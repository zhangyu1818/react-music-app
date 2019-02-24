import React, { createRef, PureComponent } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import BScroll from 'better-scroll';
import PlayListItem, { PlayListItemProps } from './PlayListItem';
interface PlayListState {
  [propName: string]: any;
}
interface PlayListProps {
  onChange?: Function;
  [propName: string]: any;
}
class PlayList extends PureComponent<PlayListProps, PlayListState> {
  scrollEle = createRef<HTMLDivElement>();
  scrollController: BScroll | undefined;
  state = {
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
      location: { state }
    } = this.props;
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
        bounce: {
          top: true,
          bottom: false,
          left: false,
          right: false
        }
      });
      this.scrollController.on('scroll', ({ y }) => {
        if (y > 0) {
          onChange &&
            onChange({
              picUrl: this.state.playList.coverImgUrl,
              scale: 1 + y / 700
            });
        }
      });
    }
  }

  render() {
    const { playList } = this.state;
    return (
      <div className={styles.playList}>
        <div className={styles.header} />
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
