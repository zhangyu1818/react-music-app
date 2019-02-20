import * as types from './actionType';
import loopType from './loopType';

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
  isPlay: boolean;
  loopType: loopType;
}
export interface Action {
  type: string;
  isPlay?: boolean;
  payload?: any;
  loopType?: any;
}

export const initialState: State = {
  current: {
    url: undefined,
    albumName: undefined,
    id: undefined,
    name: undefined,
    picUrl: undefined,
    singerId: undefined,
    singerName: undefined,
    lyric: undefined,
    translateLyric: undefined
  },
  isPlay: false,
  loopType: loopType.order
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
    default:
      return state;
  }
};
