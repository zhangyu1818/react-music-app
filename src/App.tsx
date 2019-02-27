import React, { useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Player from './pages/Player';
import { initialState, reducer } from './reducer';
import Context from './context';
import Home from './pages/Home';
import SongList from './pages/SongList';
import Album from './pages/Album';
import MiniPlayer from './components/MiniPlayer';
import { playerSizeType } from './utils/types';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {}, []);
  return (
    <div
      id='content'
      className={state.playerSize === playerSizeType.mini ? 'margin' : ''}
    >
      <Context.Provider value={{ state, dispatch }}>
        <h1 className='app-title'>MUSIC</h1>
        <Router>
          <>
            <Route path='/' component={Home} />
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
