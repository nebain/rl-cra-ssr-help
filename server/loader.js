// Express requirements
import path from 'path';
import fs from 'fs';

// React requirements
import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { StaticRouter } from 'react-router';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import stats from '../build/react-loadable.json';

import App from '../src/app/app';
import manifest from '../build/asset-manifest.json';

// LOADER
export default (req, res) => {
  const injectHTML = (data, { html, title, meta, body, scripts, state }) => {
    data = data.replace('<html>', `<html ${html}>`);
    data = data.replace(/<title>.*?<\/title>/g, title);
    data = data.replace('</head>', `${meta}</head>`);
    data = data.replace(
      '<div id="root"></div>',
      `<div id="root">${body}</div><script>window.__PRELOADED_STATE__ = ${state}</script>` + scripts.join('')
    );

    return data;
  };

  // Load in our HTML file from our build
  fs.readFile(
    path.resolve(__dirname, '../build/index.html'),
    'utf8',
    (err, htmlData) => {
      // If there's an error... serve up something nasty
      if (err) {
        console.error('Read error', err);

        return res.status(404).end();
      }

      const context = {};
      const modules = [];

      const routeMarkup = renderToString(
        <Loadable.Capture report={m => modules.push(m)}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </Loadable.Capture>
      );
      if (context.url) {
        res.writeHead(302, {
          Location: context.url
        });

        res.end();
      } else {
        let bundles = getBundles(stats, modules);
        console.log("MODULES------");
        console.log(modules);
        console.log("BUNDLES------");
        console.log(bundles);

        const extraChunks = bundles
          .filter(bundle => bundle.file.endsWith(".js"))
          .map(bundle => {
            return `<script type="text/javascript" src="/${bundle.file}"></script>`;
          });
        console.log("extraChunks----");
        console.log(extraChunks);

        // We need to tell Helmet to compute the right meta tags, title, and such
        const helmet = Helmet.renderStatic();

        // NOTE: Disable if you desire
        // Let's output the title, just to see SSR is working as intended
        // console.log('THE TITLE', helmet.title.toString());

        // Pass all this nonsense into our HTML formatting function above
        const html = injectHTML(htmlData, {
          html: helmet.htmlAttributes.toString(),
          title: helmet.title.toString(),
          meta: helmet.meta.toString(),
          body: routeMarkup,
          scripts: extraChunks,
          state: null
        });

        // We have all the final HTML, let's send it to the user already!
        res.send(html);
      }
    }
  );
};
