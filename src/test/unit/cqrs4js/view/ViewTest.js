'use strict';

import {createView, EventBus, Event} from '../../../../main/js/cqrs4js/cqrs4js';
import assert from 'assert';
import should from 'should';

describe('View', function () {
  it("throws when no event bus provided", function () {
    assert.throws(function () {
      createView(null, "");
    });
  });

  it("subscribe given event name and action", function () {
    class FakeEventBus extends EventBus {
      constructor(collector) {
        super();
        this.collector = collector;
      }

      subscribe(messageName, callback) {
        this.collector.push({messageName, callback});
      }
    }
    const collector = new Array();
    const fakeEventBus = new FakeEventBus(collector);
    createView(fakeEventBus, {},
      {
        'name': 'eventName1',
        'action': function () {
        }
      });
    assert.equal(1, collector.length);
  });
  it("subscribe given event names and actions", function () {
    class FakeEventBus extends EventBus {
      constructor(collector) {
        super();
        this.collector = collector;
      }

      subscribe(messageName, callback) {
        this.collector.push({messageName, callback});
      }
    }
    const collector = [];
    const fakeEventBus = new FakeEventBus(collector);
    createView(fakeEventBus, {},
      {
        'name': 'eventName1',
        'action': function () {
        }
      }, {
        'name': 'eventName2',
        'action': function () {
        }
      }
    );
    assert.equal(2, collector.length);
  });
  it("register actions for given event names", function (done) {
    let counter = 0;
    const eventBus = new EventBus();
    const name1 = "messageName1";
    const name2 = "messageName2";
    createView(eventBus, {},
      {
        'name': name1,
        'action': () => {
          counter += 1;
          if (counter == 3) {
            done();
          }
        }
      }, {
        'name': name2,
        'action': () => {
          counter += 2;
          if (counter == 3) {
            done();
          }
        }
      }
    );
    eventBus.publish(new Event(name1));
    eventBus.publish(new Event(name2));
  });
  it("keeps state between calls", function (done) {
    const eventBus = new EventBus();
    const name1 = "messageName1";
    createView(eventBus, 0, {
        'name': name1,
        'action': (message, counter) => {
          const newCounter = counter + 1;
          if (newCounter == 3) {
            done();
          }
          return newCounter;
        }
      }
    );
    eventBus.publish(new Event(name1));
    eventBus.publish(new Event(name1));
    eventBus.publish(new Event(name1));
  });

  it("notify subscribers provides state on subscription", function (done) {
    const eventBus = new EventBus();
    const name = "messageName";
    const expectedState = 2;
    const subscribe = createView(eventBus, expectedState,
      {
        'name': name,
        'action': () => {
        }
      }
    );
    subscribe(function (state) {
      should.equal(state, expectedState);
      done();
    });
  });


  it("notify subscribers after each event handling", function (done) {
    const eventBus = new EventBus();
    const name = "messageName";
    const expected = "1";
    const subscribe = createView(eventBus, 0,
      {
        'name': name,
        'action': () => {
          return expected;
        }
      }
    );
    subscribe(function (state) {
      if (state === expected) {
        done();
      }
    });
    eventBus.publish(new Event(name));
  });

  it("doesn't notify subscribers when no state change is done", function (done) {
    const eventBus = new EventBus();
    const name = "messageName";
    const firstPayload = "1";
    const subscribe = createView(eventBus, firstPayload,
      {
        'name': name,
        'action': (event) => {
          return event.payload;
        }
      }
    );
    const secondPayload = "2";
    let counter = 0;
    subscribe(function (state) {
      counter++;
      if (state === secondPayload && counter == 2) {
        done();
      }
    });
    eventBus.publish(new Event(name, firstPayload));
    eventBus.publish(new Event(name, firstPayload));
    eventBus.publish(new Event(name, secondPayload));
  });


  it("unsubscribe", function (done) {
    const eventBus = new EventBus();
    const name = "messageName";
    const unexpected = "wrong";
    const subscribe = createView(eventBus, 0,
      {
        'name': name,
        'action': () => {
          return unexpected;
        }
      }
    );
    let called = 0;
    const unsubscribe = subscribe(() => {
      called += 1;
    });
    unsubscribe(() => {
      eventBus.publish(new Event(name));
      setTimeout(() => {
        if (called === 1) {
          done();
        }
      }, 10);
    });
  });
});
