import * as types from './actionType';
export interface State {
  current: {
    url: string;
  };
}
export interface Action {
  type: string;
  payload?: any;
}
export const initialState: State = {
  current: {
    url: ''
  }
};
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case types.CHANGE_CURRENT_SONG:
      if (action.payload === undefined)
        throw new Error(
          "when you want to use the action whose type is 'CHANGE_CURRENT_SONG',the action.payload is required"
        );
      return {
        ...state,
        current: action.payload
      };
    default:
      return state;
  }
};
