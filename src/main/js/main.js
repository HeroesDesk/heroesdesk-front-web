'use strict';

import React,  { Component, PropTypes} from 'react';
import Router, { Route, DefaultRoute, RouteHandler } from 'react-router';

import {EventBus, CommandBus, createView} from '../js/cqrs4js/cqrs4js';

import {createConversationsView} from "./conversation/ConversationsView";
import createProvider from "./cqrs4js/react/ContextFactory";
import {ViewRegister} from "./cqrs4js/cqrs4js";

import ConversationsUi from './conversation/ConversationsUi';

const eventBus = new EventBus();
const commandBus = new CommandBus();
const viewRegister = new ViewRegister();

viewRegister.register('conversationsView', createConversationsView(eventBus));

const Provider = createProvider(React);

const App = React.createClass({
  render: function () {
    return (
      <div >
        <RouteHandler />
      </div>
    );
  }
});

const Routes = (
  <Route name="home" path="/" handler={App}>
    <DefaultRoute handler={ConversationsUi}/>
  </Route>
);

Router.run(Routes, function (RouteHandler) {
  React.render(<Provider eventBus={eventBus}
                         commandBus={commandBus}
                         viewRegister={viewRegister}
  >
    {() => <RouteHandler />}</Provider>, document.getElementById("app"));
});
