'use strict';

import Immutable from 'immutable';
import {check} from '../../utils/check';

// In React, just with Views, one should register each of them manually
// To avoid this hassle, the ViewRegister keeps all the views and is the only view related element bound through the ContextFactory
export class ViewRegister {

  constructor() {
  }

  register(name, view) {
    check.notNull({'name': name, 'view': view});
    console.log("Registered view " + name);
    this.initIfNeeded();
    this.map = this.map.set(name, view);
  }

  subscribe(name, onViewChangedCallback) {
    check.notNull({'name': name, 'onViewChangedCallback': onViewChangedCallback});
    this.initIfNeeded();
    if (this.map.has(name) == false) {
      throw new Error("View '" + name + "' not existing.");
    }
    console.log("Subscription to " + name);
    return this.map.get(name)(onViewChangedCallback);
  }

  // private method - do not use
  initIfNeeded() {
    if (this.map == null) {
      this.map = Immutable.Map();
    }
  }

}