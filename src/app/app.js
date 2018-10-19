import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import Routes from './routes';

class App extends Component {
  render() {
    return (
      <div id="app">
        <Routes />
        <Link to="/about">About</Link><br/>
        <Link to="/">Home</Link>
      </div>
    );
  }
}

export default withRouter(App);
