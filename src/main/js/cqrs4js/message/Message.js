'use strict';

import Uuid from 'node-uuid';
import {check} from '../../utils/check';
import {ObjectUtils} from '../../utils/ObjectUtils';

// The Message class freezes all its attributes in the constructor: no other attribute can be added and current ones can have their value modified.
// Mind though that Object.freeze don't throw exception when trying to set a value, the new value is silently ignored. It throws a TypeError when trying to add new attributes.
//
// The name is mandatory.
//
// Message's subclasses must wrap their own attributes in the payload and define getters.
export class Message {

  constructor(name, payloadOrNull) {
    check.notNull({'name': name});
    this.uuid = Uuid.v4(); // TODO : check generation time
    this.name = name;
    this.payload = payloadOrNull;
    ObjectUtils.freezeDeep(this);
  }
}
