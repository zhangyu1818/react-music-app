import * as types from './actionType';
import { loopTypes, playerSizeType } from '../utils/types';
import { shuffle, clamp } from 'lodash';

export interface Song {
  url: undefined;
  albumName: undefined;
  id: undefined;
  name: undefined;
  picUrl: undefined;
  singer: [];
  lyric: undefined;
  translateLyric: undefined;

  [propName: string]: any;
}

export interface State {
  [index: string]: any;
  current: {
    url: string | undefined;
    albumName: string | undefined;
    id: number | undefined;
    name: string | undefined;
    picUrl: string | undefined;
    singer: any[];
    lyric: string | undefined;
    translateLyric: string | undefined;
    [propName: string]: any;
  };
  currentId: number | undefined;
  currentIndex: number | undefined;
  isPlay: boolean;
  loopType: loopTypes;
  playList: Song[];
  musicList: Song[];
  playerSize: playerSizeType;
  showPlayer: boolean;
  loading: boolean;
}

export interface Action {
  type: string;
  isPlay?: boolean;
  song?: any;
  loopType?: loopTypes;
  playList?: any;
  size?: playerSizeType;
  track?: any;
  songId?: number;
}

export const initialState: State = {
  current: <Song>{
    singer: []
  },
  currentId: undefined,
  currentIndex: undefined,
  musicList: [],
  playList: [],
  isPlay: false,
  loopType: loopTypes.order,
  playerSize: playerSizeType.normal,
  showPlayer: false,
  loading: false
};
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    // 改变当前播放的音乐
    case types.CHANGE_CURRENT_SONG: {
      if (action.song === undefined) return state;
      return {
        ...state,
        current: action.song,
        loading: false
      };
    }
    case types.LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    // 改变播放状态
    case types.CHANGE_PLAY_STATE: {
      if (action.isPlay === undefined) return state;
      return {
        ...state,
        isPlay: action.isPlay
      };
    }
    // 改变循环播放
    case types.CHANGE_LOOP_TYPE: {
      if (action.loopType === undefined) return state;
      const playList =
        action.loopType === loopTypes.shuffle &&
        state.loopType !== loopTypes.shuffle
          ? shuffle(state.musicList)
          : action.loopType === loopTypes.order
          ? state.musicList
          : state.playList;
      const currentIndex = playList.findIndex(
        (value) => value.id === state.currentId
      );
      return {
        ...state,
        playList,
        currentIndex,
        loopType: action.loopType
      };
    }
    // 改变播放列表
    case types.CHANGE_PLAY_LIST: {
      if (action.playList === undefined) return state;
      return {
        ...state,
        musicList: action.playList,
        playList: action.playList,
        currentId: action.playList[0].id,
        currentIndex: 0,
        loopType: loopTypes.order
      };
    }
    // 从播放列表删除一首歌
    case types.DELETE_SONG: {
      if (action.songId === undefined) return state;
      const playList = state.playList.filter(
        (item) => item.id !== action.songId
      );
      const musicList = state.musicList.filter(
        (item) => item.id !== action.songId
      );
      const isCurrentSong = state.currentId === action.songId;
      const currentId = playList.length
        ? isCurrentSong
          ? playList[state.currentIndex || 0].id
          : state.currentId
        : undefined;
      const currentIndex = isCurrentSong
        ? state.currentIndex
        : playList.findIndex((item) => item.id === currentId);
      return {
        ...state,
        playList,
        musicList,
        currentId,
        currentIndex
      };
    }
    // 删除所有
    case types.INIT_LIST: {
      return {
        ...state,
        playList: [],
        musicList: [],
        currentIndex: undefined,
        currentId: undefined
      };
    }
    // 播放一首歌
    case types.ADD_MUSIC: {
      {
        if (!action.track) return state;
        const isHas = state.playList.findIndex(
          (item) => item.id === action.track.id
        );
        if (~isHas) {
          const currentId = action.track.id;
          return {
            ...state,
            currentId,
            currentIndex: isHas
          };
        }
        const playList = [...state.playList];
        playList.splice(state.currentIndex || 0, 0, action.track);
        const musicList = [...state.playList];
        const currentIndex =
          musicList.findIndex((item) => item.id === state.currentId) + 1;
        musicList.splice(currentIndex, 0, action.track);
        const currentId = action.track.id;
        return {
          ...state,
          playList,
          musicList,
          currentId,
          currentIndex
        };
      }
    }
    // 显示播放器
    case types.SHOW_PLAYER: {
      return {
        ...state,
        showPlayer: true
      };
    }
    // 改变播放器大小
    case types.CHANGE_PLAYER_SIZE: {
      if (action.size === undefined) return state;
      return {
        ...state,
        playerSize: action.size
      };
    }
    // 上一首，下一首
    case types.NEXT_SONG: {
      const nextIndex =
        ((state.currentIndex || 0) + 1) % state.musicList.length;
      const nextSongId = state.playList[nextIndex].id;
      return {
        ...state,
        currentId: nextSongId,
        currentIndex: nextIndex
      };
    }
    case types.PREV_SONG: {
      const temp = (state.currentIndex || 0) - 1;
      const nextIndex =
        temp < 0 ? state.musicList.length - 1 : temp % state.musicList.length;
      const nextSongId = state.playList[nextIndex].id;
      return {
        ...state,
        currentId: nextSongId,
        currentIndex: nextIndex
      };
    }
    default:
      return state;
  }
};
