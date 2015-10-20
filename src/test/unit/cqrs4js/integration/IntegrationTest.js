'use strict';

import {createView, createModel, EventBus, Command, CommandBus, Event} from '../../../../main/js/cqrs4js/cqrs4js';
import {ObjectUtils} from '../../../../main/js/utils/ObjectUtils';
import should from 'should';
import _ from 'lodash';

describe('CQRS and ES', function () {
  it("works from end to end", function () {

    let commandBus = new CommandBus();
    let eventBus = new EventBus();

    //the model responsible for handling addUser commands
    createModel(commandBus, eventBus, [], {
      'name': "addUser",
      'action': (command, state, eventBus) => {
        const userToAdd = command.payload;
        var login = userToAdd.login;
        if (_.find(state, (chr) => {
            return chr === login;
          })) {
          eventBus.publish(new Event("addUserFailure", {'message': "Login already existing", 'command': command}));
          return state;
        }
        const newState = ObjectUtils.createMutableClone(state);
        newState.push(login);
        eventBus.publish(new Event("userAdded", {command}));
        return newState;
      }
    });

    //createView returns a function allowing to subscribe to the new view
    const userViewSubscriber = createView(eventBus, [], {
      'name': "userAdded",
      'action': (event, state) => {
        const newState = ObjectUtils.createMutableClone(state);
        newState.push(event.payload);
        return newState;
      }
    });

    var users = {};
    //when subscribing one is given the state of the view
    userViewSubscriber(function (state) {
      users = state;
    });

    commandBus.publish(new Command("addUser", {login: 'foo'}));
    //this second command trigger an addUserFailure event
    commandBus.publish(new Command("addUser", {login: 'foo'}));

    should.equal(users.length, 1);
  });
});
