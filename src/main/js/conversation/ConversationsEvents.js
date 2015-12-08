'use strict';

import {Event} from '../cqrs4js/cqrs4js';

export class ConversationAdded extends Event {

  constructor(content) {
    super(ConversationAdded.eventName(), content);
  }

  getConversation(){
    return {id : this.uuid, label: this.payload} ;
  }

  static eventName(){
    return "ConversationAdded";
  }
}

export class ConversationAddedAddFailed extends Event {

  constructor(content) {
    super(ConversationAddFailed.eventName(), content);
  }

  static eventName(){
    return "ConversationAddFailed";
  }
}

export class ConversationDeleted extends Event {

  constructor(conversationId) {
    super(ConversationDeleted.eventName(), conversationId);
  }

  static eventName(){
    return "ConversationDeleted";
  }
}

export class ConversationDeletionFailed extends Event {

  constructor(reason) {
    super(ConversationDeletionFailed.eventName(), reason);
  }

  static eventName(){
    return "ConversationDeletionFailed";
  }
}