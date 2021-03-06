'use strict';

import React from 'react';
import Router from 'react-router';
import {I18n} from './i18n/i18n.js';

require('../less/main.less');

const appNode = document.getElementById("app");

var {
  Route,
  Redirect,
  RouteHandler,
  Link
  } = Router;

var App = React.createClass({
  render: function () {
    return (
      <div>
        <header>
          <ul>
            <li><Link to="i18n">I18n</Link></li>
          </ul>
        </header>
        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="i18n" handler={I18n}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, appNode);
});


