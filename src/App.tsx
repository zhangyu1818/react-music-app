import React, { useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Player from './pages/Player';
import { initialState, reducer } from './reducer';
import Context from './context';
import Home from './pages/Home';
import SongList from './pages/SongList';
import Album from './pages/Album';
import MiniPlayer from './components/MiniPlayer';
import { playerSizeType } from './utils/types';
import HomeHeader from './components/HomeHeader';
import Search from './pages/Search';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {}, []);
  return (
    <div
      id='content'
      className={state.playerSize === playerSizeType.mini ? 'margin' : ''}
    >
      <Context.Provider value={{ state, dispatch }}>
        <Router>
          <>
            <HomeHeader />
            <Switch>
              <Route path='/search' exact component={Search} />
              <Route path='/' component={Home} />
            </Switch>
            <Route path='/playList' exact component={SongList} />
            <Route path='/album' exact component={Album} />
          </>
        </Router>
        <Player />
        <MiniPlayer />
      </Context.Provider>
    </div>
  );
};

export default App;
