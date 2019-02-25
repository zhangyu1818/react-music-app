import * as types from './actionType';
import { loopType, playerSizeType } from '../utils/types';

export interface Song {
  url: undefined;
  albumName: undefined;
  id: undefined;
  name: undefined;
  picUrl: undefined;
  singerId: undefined;
  singerName: undefined;
  lyric: undefined;
  translateLyric: undefined;
  [propName: string]: any;
}

export interface State {
  current: {
    url: string | undefined;
    albumName: string | undefined;
    id: number | undefined;
    name: string | undefined;
    picUrl: string | undefined;
    singerId: number | undefined;
    singerName: string | undefined;
    lyric: string | undefined;
    translateLyric: string | undefined;
    [propName: string]: any;
  };
  currentId: number | undefined;
  currentIndex: number | undefined;
  isPlay: boolean;
  loopType: loopType;
  playList: Song[];
  musicList: Song[];
  playerSize: playerSizeType;
  showPlayer: boolean;
}
export interface Action {
  type: string;
  isPlay?: boolean;
  payload?: any;
  loopType?: loopType;
  playList?: any;
  size?: playerSizeType;
}

export const initialState: State = {
  current: <Song>{},
  currentId: undefined,
  currentIndex: undefined,
  musicList: [],
  playList: [],
  isPlay: false,
  loopType: loopType.order,
  playerSize: playerSizeType.normal,
  showPlayer: false
};
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    // 改变当前播放的音乐
    case types.CHANGE_CURRENT_SONG:
      if (action.payload === undefined) return state;
      return {
        ...state,
        current: action.payload
      };
    // 改变播放状态
    case types.CHANGE_PLAY_STATE:
      if (action.isPlay === undefined) return state;
      return {
        ...state,
        isPlay: action.isPlay
      };
    // 改变循环播放
    case types.CHANGE_LOOP_TYPE:
      if (action.loopType === undefined) return state;
      return {
        ...state,
        loopType: action.loopType
      };
    // 改变播放列表
    case types.CHANGE_PLAY_LIST:
      if (action.playList === undefined) return state;
      console.log(action.playList);
      return {
        ...state,
        musicList: action.playList,
        playList: action.playList,
        currentId: action.playList[0].id,
        currentIndex: 0
      };
    // 显示播放器
    case types.SHOW_PLAYER:
      return {
        ...state,
        showPlayer: true
      };
    case types.CHANGE_PLAYER_SIZE:
      if (action.size === undefined) return state;
      return {
        ...state,
        playerSize: action.size
      };
    // 上一首，下一首
    case types.NEXT_SONG:
      const nextIndex =
        ((state.currentIndex || 0) + 1) % state.musicList.length;
      const nextSongId = state.playList[nextIndex].id;
      return {
        ...state,
        currentId: nextSongId,
        currentIndex: nextIndex
      };
    default:
      return state;
  }
};
