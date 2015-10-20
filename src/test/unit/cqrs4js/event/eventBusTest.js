'use strict';

import {Message, EventBus, Event} from '../../../../main/js/cqrs4js/cqrs4js';
import assert from 'assert';

describe('eventBus', function () {
  const eventBus = new EventBus();
  it("publishes  events", function () {
    eventBus.publish(new Event("name"));
  });

  it("publishes  event's subclass", function () {
    class EventSubClass extends Event {
      constructor() {
        super("name", null);
      }
    }
    eventBus.publish(new EventSubClass());
  });

  it("throws when publishing  Message", function () {
    assert.throws(function () {
      eventBus.publish(new Message("tt"));
    });
  });

  it("throws when publishing  null", function () {
    assert.throws(function () {
      eventBus.publish(null);
    });
  });

  it('allows publishing even if no subscriber', function () {
    eventBus.publish(new Event("dd"));
  });

  it('allows multiple subscribers', function (done) {
    let called = 0;
    eventBus.subscribe("name", () => {
      called++;
      if( called === 2){
        done();
      }
    });
    eventBus.subscribe("name", () => {
      called++;
      if( called === 2){
        done();
      }
    });
    eventBus.publish(new Event("name"));
  });
});
