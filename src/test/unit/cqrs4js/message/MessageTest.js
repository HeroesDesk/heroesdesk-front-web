'use strict';

import {Message} from '../../../../main/js/cqrs4js/cqrs4js';
import assert from 'assert';

describe('Message', function () {
  it("has an uuid", function () {
    assert(new Message("foo", "bar").uuid !== null);
  });
  it("throws Error if no name provided", function () {
    assert.throws(function () {
      new Message(null, "bar");
    });
  });
  describe('subclasses', function () {
    it("cannot add keys outside of Message's payload", function () {
      class BrokenMessage extends Message {
        constructor(bar, foo) {
          super(bar, foo);
          this.combination = bar + foo; // doesn't work, object of the test !!
        }
      }
      assert.throws(function () {
        new BrokenMessage("t", "oc");
      }, TypeError);
    });

    it("can provide payload", function () {
      class WorkingMessage extends Message {
        constructor(name, payload) {
          super(name, payload);
        }
      }
      const payload = "payload";
      assert.equal(payload, new WorkingMessage("WorkingMessage", payload).payload);
    });


    it("can define functions", function () {
      class MessageWithFunction extends Message {
        constructor(name, payload) {
          super(name, payload);
        }

        nicePayload() {
          return "nice" + payload;
        }
      }
      const payload = "payload";
      assert.equal("nice" + payload, new MessageWithFunction("WorkingMessage", payload).nicePayload());
    });
  });
});

