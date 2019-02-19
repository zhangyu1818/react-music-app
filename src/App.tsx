import React, { useEffect, useState, useReducer } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Player from './pages/Player';
import { initialState, reducer } from './reducer';
import Context from './context';
import Home from './pages/Home';
import Search from './pages/Search';
import { CHANGE_CURRENT_SONG } from './reducer/actionType';
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    fetch('http://localhost:3001/song/url?id=187067')
      .then(res => res.json())
      .then(({ data }) => {
        console.log(data[0])
        dispatch({ type: CHANGE_CURRENT_SONG, payload: data[0] });
      });
  }, []);
  return (
    <Context.Provider value={{ state, dispatch }}>
      <Router>
        <>
          <Route path='/' exact component={Home} />
          <Route path='/search' exact component={Search} />
        </>
      </Router>
      <Player />
    </Context.Provider>
  );
};

export default App;
