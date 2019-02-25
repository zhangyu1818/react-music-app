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
// const initialState: PlayListState = {
//   opacity: 0,
//   playList: {
//     coverImgUrl: '',
//     playCount: 0,
//     name: '',
//     creator: {
//       avatarUrl: '',
//       nickname: ''
//     },
//     tracks: []
//   }
// };
// const PlayList = (props: PlayListProps) => {
//   const { state: contextState, dispatch } = useContext(Context);
//   const scrollEle = useRef<HTMLDivElement | null>(null);
//   const scrollController = useRef<BScroll | null>(null);
//   const [state, setState] = useState(initialState);
//   useEffect(() => {
//     const { onChange, location, history } = props;
//     if (!location.state) {
//       history.push('/');
//       return;
//     }
//     fetch(`/playlist/detail?id=${location.state.id}`)
//       .then((res) => res.json())
//       .then(({ playlist }) => {
//         console.log(playlist);
//         setState({ ...state, playList: playlist });
//         console.log(playlist.coverImgUrl);
//         onChange && onChange({ picUrl: playlist.coverImgUrl });
//         if (scrollEle.current) {
//           scrollController.current = new BScroll(scrollEle.current, {
//             probeType: 3,
//             click: true
//           });
//           scrollController.current.on('scroll', ({ y }) => {
//             y > 0 &&
//               onChange &&
//               onChange({ picUrl: playlist.coverImgUrl, scale: 1 + y / 700 });
//             console.log(state)
//             setState({ ...state, opacity: clamp(-y / 200, 0, 1) });
//           });
//         }
//       });
//   }, []);
//   useEffect(() => {
//     const { onChange } = props;
//     onChange &&
//       onChange({
//         picUrl: state.playList.coverImgUrl,
//         scale: 1
//       });
//   }, [state.playList.coverImgUrl]);
//   const { playList, opacity } = state;
//   const playAll = () => {
//     dispatch({
//       type: CHANGE_PLAY_LIST,
//       playList: playList.tracks
//     });
//   };
//   return (
//     <div className={styles.playList}>
//       <div className={styles.header}>
//         <Link to='/'>
//           <i className={classNames('iconfont', styles.headerBackIcon)}>
//             &#xe64b;
//           </i>
//         </Link>
//         <div className={styles.headerNameWrapper} style={{ opacity: opacity }}>
//           <p className={styles.headerName}>{playList.name}</p>
//         </div>
//         <div className={styles.headerBg} style={{ opacity: opacity }} />
//       </div>
//       <div className={styles.scroll} ref={scrollEle}>
//         <div style={{ willChange: 'transform' }}>
//           <div className={styles.desc}>
//             <div className={styles.imgWrapper}>
//               <span className={styles.playCount}>
//                 <i className='iconfont'>&#xe6c2;</i>
//                 {playList.playCount / 10000 > 1
//                   ? ((playList.playCount / 10000) | 0) + '万'
//                   : playList.playCount}
//               </span>
//               <img
//                 src={playList.coverImgUrl}
//                 alt=''
//                 className={styles.coverImg}
//               />
//               <i className={classNames('iconfont', styles.listInfo)}>
//                 &#xe6e5;
//               </i>
//             </div>
//             <div className={styles.info}>
//               <h1 className={styles.playListName}>{playList.name}</h1>
//               <div className={styles.creator}>
//                 <img
//                   src={playList.creator.avatarUrl}
//                   alt=''
//                   className={styles.creatorAvatar}
//                 />
//                 <span className={styles.creatorName}>
//                   {playList.creator.nickname}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className={styles.list}>
//             <div className={styles.playAll}>
//               <button className={styles.playButton} onClick={playAll}>
//                 播放全部
//               </button>
//               <span className={styles.total}>{playList.tracks.length}首</span>
//             </div>
//             {playList.tracks.map((track: PlayListItemProps, index: number) => (
//               <PlayListItem
//                 onClick={() => console.log(1)}
//                 key={track.id}
//                 index={index + 1}
//                 name={track.name}
//                 singer={track.ar.map((ar: any) => ar.name).join('/')}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
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
        y > 0 &&
          onChange &&
          onChange({
            picUrl: this.state.playList.coverImgUrl,
            scale: 1 + y / 700
          });
        this.setState({ opacity: clamp(-y / 200, 0, 1) });
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
  onClickItem = (track: object) => {
    const { dispatch } = this.context;
    dispatch({
      type: ADD_MUSIC,
      track
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
              {playList.tracks.map((track: any, index) => (
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
