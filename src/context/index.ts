import { createContext, useEffect, useContext } from 'react';
import { initialState, State } from '../reducer';
interface Context {
  state: State;
  dispatch: Function;
}
const Context = createContext<Context>({
  state: initialState,
  dispatch: () => {}
});

interface Wather {
  [props: string]: () => void;
}

const useMyContext = (watcher?: Wather) => {
  const myContext = useContext(Context);
  const keys = Object.keys(watcher || []);
  useEffect(() => {
    keys.forEach((key) => watcher && watcher[key]());
  }, [...keys.map((key) => myContext.state[key])]);
  return myContext;
};

export default Context;
export { useMyContext };
