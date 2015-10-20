'use strict';

import {initStateHolder} from "../utils/initStateHolder";
import {check} from '../../utils/check';


export const createModel = (commandBus, eventBus, initialState, ...listenedCommandsNamesAndActions) => {
  const freeze = initStateHolder(listenedCommandsNamesAndActions);
  check.notNull({'commandBus': commandBus}, {'eventBus': eventBus});

  let state = freeze(initialState);

  listenedCommandsNamesAndActions.forEach((actionAndName) => {
    const commandName = actionAndName.name;
    const action = actionAndName.action;

    console.log("INFO : about to register command named %s", commandName);
    console.log("DEBUG : registering action %s", "" + action);

    commandBus.subscribe(commandName, (command) => {
      state = freeze(action(command, state, eventBus));
    });
  });

};
