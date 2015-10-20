'use strict';

import {Message} from './Message';
import {EventEmitter} from 'events';

export class MessageBus {
  constructor() {
    this.messageEmitter = new EventEmitter();
  }

  publish(message) {
    this.checkPublish(message);
    console.log('INFO : publishing message', message);
    this.messageEmitter.emit(message.name, message);
    return;
  }

  subscribe(messageName, callback) {
    this.checkSubscribe(messageName, callback);
    this.messageEmitter.on(messageName, callback);
    console.log("INFO : subscription to %s", messageName);
    console.log("DEBUG : subscribing callback %s", "" + callback);
    return;
  }

  checkSubscribe() {
  }

  checkPublish(message) {
    if (!(message instanceof Message )) {
      throw new Error("Publish works only on instances of Message");
    }
  }
}