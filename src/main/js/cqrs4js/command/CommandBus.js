'use strict';

import {MessageBus} from '../message/MessageBus';
import {Command} from './Command';

export class CommandBus extends MessageBus {

  publish(command) {
    super.publish(command);
  }

  checkPublish(command) {
    super.checkPublish(command);
    if (!(command instanceof Command )) {
      throw new Error("Publish works only on commands");
    }
    const name = command.name;
    const listeners = this.getListeners(name);
    if (listeners.length == 0) {
      throw new Error("No subscriber for '" + name + "'");
    }
  }

  getListeners(name) {
    return this.messageEmitter.listeners(name);
  }

  checkSubscribe(commandName, callback) {
    super.checkSubscribe(commandName, callback);
    const listeners = this.getListeners(commandName);
    const length = listeners.length;
    if (length == 1) {
      throw new Error("Subscriber already present  for '" + commandName + "': '" + listeners[0] + "'");
    }
    if (length > 1) {
      throw new Error("Unexpected state: '" + length + "' subscribers for '" + commandName + "', here be dragons! Subscribers: " + listeners);
    }
  }

}
