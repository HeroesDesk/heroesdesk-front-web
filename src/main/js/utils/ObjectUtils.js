'use strict';

import {check} from './check'
import _ from 'lodash';

export class ObjectUtils {
  static freeze(obj) {
    console.log("DEBUG : value to freeze "  + obj);
    if (obj === undefined) {
      return obj;
    }
    console.log("DEBUG : about to freeze effectively");
    return Object.freeze(obj);
  }

  static freezeDeep(obj) {
    if (obj === undefined) {
      return obj;
    }
    if (obj != null) {
      const propNames = Object.getOwnPropertyNames(obj);
      propNames.forEach((name) => {
        const prop = obj[name];
        if (typeof prop == 'object' && !Object.isFrozen(prop))
          ObjectUtils.freezeDeep(prop);
      });
    }
    return ObjectUtils.freeze(obj);
  }

  static createMutableClone(state) {
    return _.cloneDeep(state);
  }

  static toString(message) {
    if (message instanceof Function) {
      return message();
    } else {
      return message;
    }
  }

}