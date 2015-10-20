'use strict';

import {Message, MessageBus} from '../../../../main/js/cqrs4js/cqrs4js';
import assert from 'assert';


describe('MessageBus publishing', function () {
  const messageBus = new MessageBus();
  it("handles messages", function () {
    messageBus.publish(new Message("name", "payload"));
  });

  it("handles message's subclass", function () {

    class WorkingMessage extends Message {
      constructor() {
        super("workingMessage", "staticPayload");
      }
    }
    messageBus.publish(new WorkingMessage());
  });

  it("throws Error if something else then message provided", function () {
    assert.throws(function () {
      messageBus.publish(new Object());
    });
  });

  it("throws Error if null provided", function () {
    assert.throws(function () {
      messageBus.publish();
    });
  });

  it("effectively emits messages", function (done) {
    const messageName = "message";
    messageBus.subscribe(messageName, (a) => {
      done();
    });
    messageBus.publish(new Message(messageName, "payload"));
  });

});

