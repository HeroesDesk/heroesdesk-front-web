'use strict';

import Immutable from 'immutable';
import {createView} from '../cqrs4js/cqrs4js';
import {ConversationAdded,ConversationDeleted} from "./ConversationsEvents";

export const createConversationsView = (eventBus) => {
  const viewSubscriber = createView(eventBus, Immutable.List(),
    {
      'name': ConversationAdded.eventName(),
      'action': (event, state) => {
        return state.push(event.getConversation());
      }
    },
    {
      'name': ConversationDeleted.eventName(),
      'action': (event, state) => {
        const deletedConversation = event.payload;
        var deletedConversationIndex = state.indexOf(deletedConversation);
        return state.splice(deletedConversationIndex, 1);
      }
    }
  );
  return (cbk) => viewSubscriber(cbk);
};