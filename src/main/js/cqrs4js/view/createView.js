'use strict';

import {initStateHolder} from "../utils/initStateHolder"
import {EventEmitter} from 'events';
import {check} from '../../utils/check';
import _ from 'lodash';

export const createView = (eventBus, initialState, ...listenedEventNamesAndActions) => {
  const freeze = initStateHolder(listenedEventNamesAndActions);
  check.notNull({'eventBus': eventBus});

  const messageEmitter = new EventEmitter();
  let state = freeze(initialState);

  listenedEventNamesAndActions.forEach((actionAndName) => {
    const name = actionAndName.name;
    const action = actionAndName.action;

    console.log("INFO : about to register an action for event named %s", name);
    console.log("DEBUG : registered action %s", "" + action);

    eventBus.subscribe(name, (event) => {
      const newState = freeze(action(event, state));
      if (newState !== state) {
        state = newState;
        messageEmitter.emit('change', state);
      } else {
        console.log("DEBUg : No change detected. Previous state %s, new state %s", state, newState);
      }
    });
  });

  messageEmitter.on('addSubscriber', (cbk) => {
    console.log("DEBUG : about to subscribe %s", "" + cbk);
    messageEmitter.on('change', cbk);
    cbk(state);
  });

  return (cbk) => {
    const effectiveCallback = (state) => cbk(state);
    messageEmitter.emit('addSubscriber', effectiveCallback);
    return (cb) => {
      console.log("DEBUG  : about to remove %s", "" + effectiveCallback);
      messageEmitter.removeListener('change', effectiveCallback);
      cb();
    }
  };
};
