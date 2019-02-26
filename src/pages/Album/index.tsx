import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import BScroll from 'better-scroll';
import PlayListItem from '../../components/PlayListItem';
import { Link } from 'react-router-dom';
import { useMyContext } from '../../context';
import { ADD_MUSIC, CHANGE_PLAY_LIST } from '../../reducer/actionType';
import { clamp } from 'lodash';

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
  const { dispatch } = useMyContext({
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
    fetch(`/album?id=${state.id}`)
      .then((res) => res.json())
      .then((data) => {
        const { album, songs } = data;
        setAlbumState({ ...albumState, album, songs });
      });
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
    <div className={styles.playList}>
      <div className={styles.header}>
        <Link to='/'>
          <i className={classNames('iconfont', styles.headerBackIcon)}>
            &#xe64b;
          </i>
        </Link>
        <div className={styles.headerBg} ref={headerBg}>
          <p className={styles.headerName}>{albumState.album.name}</p>
        </div>
      </div>
      <div className={styles.bgImg} ref={bgImg}>
        <img src={albumState.album.blurPicUrl} alt='' />
      </div>
      <div className={styles.scroll} ref={scrollEle}>
        <div style={{ willChange: 'transform' }}>
          <div className={styles.desc}>
            <div className={styles.imgWrapper}>
              <img
                src={albumState.album.blurPicUrl}
                alt=''
                className={styles.coverImg}
              />
              <i className={classNames('iconfont', styles.listInfo)}>
                &#xe6e5;
              </i>
            </div>
            <div className={styles.info}>
              <h1 className={styles.playListName}>{albumState.album.name}</h1>
              <div className={styles.creator}>
                <img
                  src={albumState.album.artist.picUrl}
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
              <PlayListItem
                onClick={() => onClickItem(track)}
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

// class PlayList extends PureComponent<PlayListProps, any> {
//   static contextType = Context;
//   scrollEle = createRef<HTMLDivElement>();
//   scrollController: BScroll | undefined;
//   state = {
//     opacity: 0,
//     album: {
//       blurPicUrl: '',
//       artist: {
//         picUrl: '',
//         name: ''
//       },
//       playCount: 0,
//       name: '',
//       creator: {
//         avatarUrl: '',
//         nickname: ''
//       },
//       tracks: []
//     },
//     songs: []
//   };
//   componentDidMount() {
//     const {
//       onChange,
//       location: { state },
//       history
//     } = this.props;
//     if (!state) {
//       history.push('/');
//       return;
//     }
//     fetch(`/album?id=${state.id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         const { album, songs } = data;
//         console.log(songs)
//         this.setState({ album, songs }, () => {
//           onChange &&
//             onChange({
//               picUrl: this.state.album.blurPicUrl,
//               scale: 1
//             });
//         });
//       });
//     if (this.scrollEle.current) {
//       this.scrollController = new BScroll(this.scrollEle.current, {
//         probeType: 3,
//         click: true
//       });
//       this.scrollController.on('scroll', ({ y }) => {
//         y > 0 &&
//           onChange &&
//           onChange({
//             picUrl: this.state.album.blurPicUrl,
//             scale: 1 + y / 700
//           });
//         this.setState({ opacity: clamp(-y / 200, 0, 1) });
//       });
//     }
//   }
//   componentWillUnmount() {
//     this.scrollController && this.scrollController.destroy();
//   }
//
//   playAll = () => {
//     const { dispatch } = this.context;
//     dispatch({
//       type: CHANGE_PLAY_LIST,
//       playList: this.state.songs
//     });
//   };
//   onClickItem = (track: object) => {
//     const { dispatch } = this.context;
//     dispatch({
//       type: ADD_MUSIC,
//       track
//     });
//   };
//   render() {
//     const { album, songs, opacity } = this.state;
//     return (
//       <div className={styles.playList}>
//         <div className={styles.header}>
//           <Link to='/'>
//             <i className={classNames('iconfont', styles.headerBackIcon)}>
//               &#xe64b;
//             </i>
//           </Link>
//           <div
//             className={styles.headerNameWrapper}
//             style={{ opacity: opacity }}
//           >
//             <p className={styles.headerName}>{album.name}</p>
//           </div>
//           <div className={styles.headerBg} style={{ opacity: opacity }} />
//         </div>
//         <div className={styles.scroll} ref={this.scrollEle}>
//           <div style={{ willChange: 'transform' }}>
//             <div className={styles.desc}>
//               <div className={styles.imgWrapper}>
//                 <img
//                   src={album.blurPicUrl}
//                   alt=''
//                   className={styles.coverImg}
//                 />
//                 <i className={classNames('iconfont', styles.listInfo)}>
//                   &#xe6e5;
//                 </i>
//               </div>
//               <div className={styles.info}>
//                 <h1 className={styles.playListName}>{album.name}</h1>
//                 <div className={styles.creator}>
//                   <img
//                     src={album.artist.picUrl}
//                     alt=''
//                     className={styles.creatorAvatar}
//                   />
//                   <span className={styles.creatorName}>
//                     {album.artist.name}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className={styles.list}>
//               <div className={styles.playAll}>
//                 <button className={styles.playButton} onClick={this.playAll}>
//                   播放全部
//                 </button>
//                 <span className={styles.total}>{songs.length}首</span>
//               </div>
//               {songs.map((track: any, index) => (
//                 <PlayListItem
//                   onClick={() => this.onClickItem(track)}
//                   key={track.id}
//                   index={index + 1}
//                   name={track.name}
//                   singer={track.ar.map((ar: any) => ar.name).join('/')}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

export default AlbumList;
