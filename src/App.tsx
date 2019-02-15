import React, { Component } from 'react';
import Player from './pages/Player';

class App extends Component {
  state = {
    url: ''
  };
  componentDidMount(): void {
    fetch('http://localhost:3001/song/url?id=187067')
      .then(res => res.json())
      .then(({ data }) => {
        this.setState({
          url: data[0].url
        });
      });
  }

  render() {
    return <Player url={this.state.url}/>;
  }
}

export default App;
