'use strict';

import Message from '../../../../main/js/cqrs/message/Message';
import MessageBus from '../../../../main/js/cqrs/message/MessageBus';
import assert from 'assert';


describe('MessageBus publishing', function () {
  const messageBus = new MessageBus();
  it("handles messages", function () {
    messageBus.publish(new Message("type", "payload"));
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
    const messageType = "messageType";
    messageBus.subscribe(messageType, () => {
      done();
    });
    messageBus.publish(new Message(messageType, "payload"));
  });

});

