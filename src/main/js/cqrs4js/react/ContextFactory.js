'use strict';
export default function createProvider(React) {
  const { Component, PropTypes, Children } = React;
  const messageBusShape = createMessageBusShape(PropTypes);
  const viewRegisterShape = createViewRegisterShape(PropTypes);
  const requireFunctionChild = isUsingOwnerContext(React);

  let didWarnAboutChild = false;

  let didWarnAboutReceivingStore = false;

  function isUsingOwnerContext(React) {
    const { version } = React;
    if (typeof version !== 'string') {
      return true;
    }

    const sections = version.split('.');
    const major = parseInt(sections[0], 10);
    const minor = parseInt(sections[1], 10);

    return major === 0 && minor === 13;
  }

  function createMessageBusShape(PropTypes) {
    return PropTypes.shape({
      publish: PropTypes.func.isRequired,
      subscribe: PropTypes.func.isRequired,
    });
  }


  function createViewRegisterShape(PropTypes) {
    return PropTypes.shape({
      register: PropTypes.func.isRequired,
      subscribe: PropTypes.func.isRequired
    });
  }

  function warnAboutFunctionChild() {
    if (didWarnAboutChild || requireFunctionChild) {
      return;
    }

    didWarnAboutChild = true;
    console.error( // eslint-disable-line no-console
      'With React 0.14 and later versions, you no longer need to ' +
      'wrap <Provider> child into a function.'
    );
  }

  function warnAboutElementChild() {
    if (didWarnAboutChild || !requireFunctionChild) {
      return;
    }

    didWarnAboutChild = true;
    console.error( // eslint-disable-line no-console
      'With React 0.13, you need to ' +
      'wrap <Provider> child into a function. ' +
      'This restriction will be removed with React 0.14.'
    );
  }

  function warnAboutReceivingStore() {
    if (didWarnAboutReceivingStore) {
      return;
    }

    let didWarnAboutReceivingStore = true;
    console.error( // eslint-disable-line no-console
      '<Provider> does not support changing `store` on the fly. ' +
      'It is most likely that you see this error because you updated to ' +
      'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' +
      'automatically. See https://github.com/rackt/react-redux/releases/' +
      'tag/v2.0.0 for the migration instructions.'
    );
  }

  return class Provider extends Component {
    static childContextTypes = {
      eventBus: messageBusShape.isRequired,
      commandBus: messageBusShape.isRequired,
      viewRegister: viewRegisterShape.isRequired
    };

    static propTypes() {
      console.log("propTypes");

      return {
        eventBus: messageBusShape.isRequired,
        commandBus: messageBusShape.isRequired,
        viewRegister: viewRegisterShape.isRequired,
        children: (requireFunctionChild ?
            PropTypes.func :
            PropTypes.element
        ).isRequired
      };
    }

    getChildContext() {
      return {
        eventBus: this.eventBus,
        commandBus: this.commandBus,
        viewRegister: this.viewRegister
      };
    }

    constructor(props, context) {
      super(props, context);
      this.eventBus = props.eventBus;
      this.commandBus = props.commandBus;
      this.viewRegister = props.viewRegister;
    }

    componentWillReceiveProps(nextProps) {
      const { store } = this;
      const { store: nextStore } = nextProps;

      if (store !== nextStore) {
        warnAboutReceivingStore();
      }
    }

    render() {
      let { children } = this.props;

      if (typeof children === 'function') {
        warnAboutFunctionChild();
        children = children();
      } else {
        warnAboutElementChild();
      }

      return Children.only(children);
    }
  };
}


