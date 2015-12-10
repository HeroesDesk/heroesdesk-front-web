'use strict';

import { Component, PropTypes, Children } from 'react';
import messageBusShape from './shapes/messageBusShape';
import viewRegisterShape from './shapes/viewRegisterShape';

export class Provider extends Component {
  getChildContext() {
    return {
      eventBus: this.eventBus,
      commandBus: this.commandBus,
      viewRegister: this.viewRegister
    }
  }

  constructor(props, context) {
    super(props, context)
    this.eventBus = props.eventBus;
    this.commandBus = props.commandBus;
    this.viewRegister = props.viewRegister;
  }

  render() {
    let { children } = this.props
    return Children.only(children)
  }
}

Provider.propTypes = {
  eventBus: messageBusShape.isRequired,
  commandBus: messageBusShape.isRequired,
  viewRegister: viewRegisterShape.isRequired,
  children: PropTypes.element.isRequired
};
Provider.childContextTypes = {
  eventBus: messageBusShape.isRequired,
  commandBus: messageBusShape.isRequired,
  viewRegister: viewRegisterShape.isRequired
};
