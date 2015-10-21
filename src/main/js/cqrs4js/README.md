# cqrs4js

A proof of concept cqrs implementation in JavaScript

# content
1. [Code example](#example)
1. [Overview](#overview)
  1. [Concepts](#concepts)
    1. [Commands](#commands)
    1. [Models](#models)
    1. [Events](#events)
    1. [Views](#views)
  1. [Command bus and event bus](#bus)
  1. [Workflow](#workflow)
    1. [Truly unidirectional](#unidirectional)
    2. [Example](#workflow-example)
  2. [Implementation choices](#impl-choices)
    1. [Right rather than fast](#right)
    1. [Asynchronous](#asynchronous)
    1. [Immutability](#immutability)
1. [Why cqrs4js?](#why)
1. [Disclaimer](#disclaimer)
 
# <a name="example"></a>Code example
```javascript
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

    console.log(users.length, " user(s) created");
```

# <a name="overview"></a>Overview

## <a name="concepts"></a>Concepts

### <a name="commands"></a>Commands

- express the will of the user to change some domain related state somehow,
- carry the required data to evaluate the change asked for,
- named after the change pursued, with a verb in imperative form, for example "AddUser" or "DeleteAccount".

### <a name="models"></a>Models

- evaluate commands
- inform of successes or failures through events
- have their own internal states if needed

### <a name="events"></a>Events

- express facts that did happen
- events' names are verbs in the past tense, for example "UserAdded" or "AccountDeleted".
- carry the data related to the fact described

### <a name="views"></a>Views

- contain the data to show to the user, based on the events received.
- anything can subscribe to a view and be notified of the state and its changes. It's mostly user interface components which subscribe to view in order to display the data to the users.
- are presentation oriented: their data are stored in the way the user interface needs. As such, views can aggregate or drop part of the events' payload, and multiple views can present the same data in different ways.

### <a name="bus"></a>Command bus and event bus

- transport, respectively, commands and events
- anyone can publish new command or event
- anyone can subscribe to some command or event name and be notified of new messages
- a command's name must be subscribed to by exactly one subscriber
- published and subscriber don't know each other
- delivery is asynchronous

## <a name="workflow"></a>Workflow

### <a name="unidirectional"></a>Truly unidirectional

Models and views are the business layer of the application.

The user interface publishes commands and facts through the relevant bus and is notified of business changes through the views. This way the dataflow is truly unidirectional, whatever the use case or validation you need to do.

### <a name="workflow-example"></a>Example

Let's consider an UI for registering.

This ui fires an command names AddUser, whose payload is the chosen login, some email and whatever optional data needed.

The user model is notified of the command, and check against its internal state that the login isn't already in used.
It checks as well that the email is a legit. The extra optional data aren't checked.

If all checks are green, it adds the new login to its internal state and published an UserAdded event with the above payload.
In case of errors

For example, when receiving the AddUser command with a login, a mail and username, a model may just check for uniqueness of the login, which requires the list of all logins, whereas the rest of the data may just be checked for being present (aka not null).

## <a name="impl-choices"></a>Implementation choices

### <a name="right"></a>Right rather than fast

As a proof of concept, cqrs4js aims to be first right on the concepts rather than fast or production ready.

### <a name="asynchronous"></a>Asynchronous

Each communication, be it through bus or when subscribing to a view, is asynchronous. There's no blocking call between any of the concepts presented above.

### <a name="immutability"></a>Immutability

Immutability is the best way to make sure some models, views or subscribers don't fiddle incorrectly with the payload or state they're given. As such, all state and messages are immutable. Update some state implies returning new objects.

# <a name="why"></a>Why cqrs4js ?

Initially, while coming from an Event Sourcing (ES) and CQRS (Command Query Request Segregation) background, we went for one of the flux implementations.

In flux, the UI fires some actions which are then consumed by stores, which in turn update the UI. This is called the unidirectional dataflow, a nice loop always flowing the same way.

However, it feels to us flux breaks when some actions must be validated and thus can fail. Indeed, where to put this validation and how to inform in case of failure?

We have seen different approaches in flux regarding this matter, from the UI doing all the validation upfront to actions able to fail and returning error messages. Either way this feels like breaking the unidirectional dataflow spoken of above.

Furthermore, what if some state must be maintained and checked against?

For example, in the case of some AddUser scenario, one could have an administration interface allowing for multiple account creations at the same time. Considering that it is done asynchronously, two actions could get the current state one after the other, and then each validate that some login is not already present and then decide to add it. No luck, these two actions could be adding ... the same login.

It means that validation requires, for some use cases at least, some state which must be next to the validation logic (and not an asynchronous call away).

Here come CQRS and the Command pattern, where the models handling the commands do the validation while having some state if needs be.

# <a name="disclaimer"></a>Disclaimer

This is a side activity from the ones working on it, so progress can be patchy, at best, and the code comes with no warranty whatsoever.

