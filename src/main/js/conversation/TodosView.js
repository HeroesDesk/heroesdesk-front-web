'use strict';

import Immutable from 'immutable';
import {createView} from 'cqrs4js';
import {TodoAdded,TodoDeleted} from "./Events";

export const createTodosView = (eventBus) => {
  const viewSubscriber = createView(eventBus, Immutable.List(),
    {
      'name': TodoAdded.eventName(),
      'action': (event, state) => {
        return state.push(event.getTodo());
      }
    },
    {
      'name': TodoDeleted.eventName(),
      'action': (event, state) => {
        const deletedTodo = event.payload;
        var deletedTodoIndex = state.indexOf(deletedTodo);
        return state.splice(deletedTodoIndex, 1);
      }
    }
  );
  return (cbk) => viewSubscriber(cbk);
};