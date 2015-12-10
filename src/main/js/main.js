'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, DefaultRoute } from 'react-router';

import {EventBus, CommandBus, Provider, ViewRegister} from './cqrs4js/cqrs4js';

import {createConversationsView} from "./conversation/ConversationsView";
import ConversationsUi from './conversation/ConversationsUi';

const eventBus = new EventBus();
const commandBus = new CommandBus();
const viewRegister = new ViewRegister();

viewRegister.register('conversationsView', createConversationsView(eventBus));


class App extends React.Component {
  render() {
    return (
      <div >
        <Router>
          <Route name="home" path="/" handler={App}>
            <DefaultRoute handler={ConversationsUi}/>
          </Route>
        </Router>
      </div>
    );
  }
}

console.log(ReactDOM);

ReactDOM.render(
  <Provider eventBus={eventBus}
            commandBus={commandBus}
            viewRegister={viewRegister}>
    <App />
  </Provider>,
  document.getElementById("app")
);