'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {EventBus, CommandBus, Provider, ViewRegister} from './cqrs4js/cqrs4js';

import {createConversationsView} from "./conversation/ConversationsView";
import ConversationsUi from './conversation/ConversationsUi';

const eventBus = new EventBus();
const commandBus = new CommandBus();
const viewRegister = new ViewRegister();

viewRegister.register('conversationsView', createConversationsView(eventBus));

ReactDOM.render(
  <Provider eventBus={eventBus}
            commandBus={commandBus}
            viewRegister={viewRegister}>
    <ConversationsUi/>
  </Provider>,
  document.getElementById("app")
);