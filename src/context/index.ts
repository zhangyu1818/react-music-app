import { createContext } from 'react';
import { initialState, State } from '../reducer';
interface Context {
  state: State;
  dispatch: Function;
}
export default createContext<Context>({
  state: initialState,
  dispatch: () => {}
});
