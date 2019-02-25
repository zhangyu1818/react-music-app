import React, { useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Player from './pages/Player';
import { initialState, reducer } from './reducer';
import Context from './context';
import Home from './pages/Home';
import PlayList from './pages/PlayList';
import MiniPlayer from './components/MiniPlayer';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {}, []);
  return (
    <Context.Provider value={{ state, dispatch }}>
      <h1 className='app-title'>MUSIC</h1>
      <Router>
        <>
          <Route path='/' component={Home} />
          <Route path='/playList' exact component={PlayList} />
        </>
      </Router>
      <Player />
      <MiniPlayer />
    </Context.Provider>
  );
};

export default App;
