import 'string.prototype.includes'; // IE 9-11 compat
import 'react-app-polyfill/ie9'; // IE 9-11 compat
import React from 'react';
import { render, hydrate } from 'react-dom';
import Loadable from 'react-loadable';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';

const Application = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

const root = document.querySelector('#root');

if (root.hasChildNodes() === true) {
  // If it's an SSR, we use hydrate to get fast page loads by just
  // attaching event listeners after the initial render
  Loadable.preloadReady().then(() => {
    hydrate(Application, root);
  });
} else {
  // If we're not running on the server, just render like normal
  render(Application, root);
}
