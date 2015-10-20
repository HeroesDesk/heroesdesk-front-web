'use strict';

import {createModel, CommandBus, Command, EventBus, Event} from '../../../../main/js/cqrs4js/cqrs4js';
import assert from 'assert';

describe('Model', function () {

  it("throws when no commandBus provided", function () {
    assert.throws(function () {
      createModel(null);
    });
  });

  it("throws when no event bus provided", function () {
    assert.throws(function () {
      createModel(new CommandBus(), null);
    });
  });

  it("subscribe given event name and action", function () {
    class FakeCommandBus extends CommandBus {
      constructor(collector) {
        super();
        this.collector = collector;
      }

      subscribe(messageName, callback) {
        this.collector.push({messageName, callback});
      }
    }
    const collector = new Array();
    const fakeCommandBus = new FakeCommandBus(collector);
    createModel(fakeCommandBus, new EventBus(), {},
      {
        'name': 'eventName1',
        'action': function () {
        }
      });
    assert.equal(1, collector.length);
  });

  it("register actions for given commands", function (done) {
    let counter = 0;
    const commandBus = new CommandBus();
    const eventBus = new EventBus();
    const name1 = "messageName1";
    const name2 = "messageName2";
    createModel(commandBus, eventBus, {},
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
    commandBus.publish(new Command(name1));
    commandBus.publish(new Command(name2));
  });

  it("keeps state between calls", function (done) {
    const commandBus = new CommandBus();
    const eventBus = new EventBus();
    const name1 = "messageName1";
    createModel(commandBus, eventBus, 0, {
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
    commandBus.publish(new Command(name1));
    commandBus.publish(new Command(name1));
    commandBus.publish(new Command(name1));
  });

});