'use strict';

import {CommandBus, Command} from '../../../../main/js/cqrs4js/cqrs4js';
import assert from 'assert';

describe('commandBus', function () {

  it("throws when publishing a command for which no subscriber is present", function () {
    const commandBus = new CommandBus();
    assert.throws(function () {
      commandBus.publish(new Command("name"));
    });
  });

  it("throws when adding a subscriber to some command name already listened to", function () {
    const commandBus = new CommandBus();
    const messageName = "test";
    commandBus.subscribe(messageName, function () {
    });
    assert.throws(function () {
      commandBus.subscribe(messageName, function () {
      });
    });
  });

  it("works", function(done){

    const commandBus = new CommandBus();
    const messageName = "test";
    var called = 0;
    commandBus.subscribe(messageName, function (message) {
      called += message.payload;
      if(called >= 6){
        done();
      }

    });
    commandBus.publish(new Command(messageName,3));
    commandBus.publish(new Command(messageName,2));
    commandBus.publish(new Command(messageName,1));
  });
});