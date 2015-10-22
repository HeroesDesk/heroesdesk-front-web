'use strict';

import {Message, ViewRegister, createView, EventBus, Event} from '../../../../main/js/cqrs4js/cqrs4js';
import assert from 'assert';
import should from 'should';
import Immutable from 'immutable';


describe('ViewRegister', function () {
  const viewRegister = new ViewRegister();
  it("throws when subscribing without giving a name", function () {
    assert.throws(function () {
      viewRegister.subscribe(null, () => console.log("shouldn't be called"));
    });
  });

  it("throws when subscribing without giving a callback", function () {
    assert.throws(function () {
      viewRegister.subscribe("foo", null);
    });
  });

  it("throws when subscribing to a non existing view", function () {
    assert.throws(function () {
      viewRegister.subscribe("foo", () => console.log("shouldn't be called"));
    });
  });

  it("registers views", function (done) {
    let viewName = "foo";
    const eventBus = new EventBus();
    const eventName = "eventName";
    viewRegister.register(viewName, createView(eventBus, "",
      {
        'name': eventName,
        'action': (event, state) => {
          console.log("called with '" + event.name + "' of payload '" + event.payload + "' and state '" + state + "'");
          return state + event.payload;
        }
      }
    ));
    viewRegister.subscribe(viewName, state => {
      if (state == "ok") {
        done();
      }
    });
    eventBus.publish(new Event(eventName, "ok"));
  });


});
