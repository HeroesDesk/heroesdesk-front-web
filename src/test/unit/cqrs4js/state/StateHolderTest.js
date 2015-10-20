'use strict';

import {StateHolder} from '../../../../main/js/cqrs4js/utils/initStateHolder';
import assert from 'assert';


describe('StateHolder', function () {

  it("throws when no listened event names provided", function () {
    assert.throws(function () {
      new StateHolder();
    });
  });

  it("throws when given listenedEventNamesAndAction missing name", function () {
    assert.throws(function () {
      new StateHolder(
        {
          'action': function () {
          }
        });
    });
  });
  it("throws when given listenedEventNamesAndAction's name isn't a String", function () {
    assert.throws(function () {
      new StateHolder(
        {
          name: ()=>true,
          'action': function () {
          }
        });
    });
  });
  it("throws when given listenedEventNamesAndAction missing action", function () {
    assert.throws(function () {
      new StateHolder(
        {
          "name": "name"
        });
    });
  });
  it("throws when given listenedEventNamesAndAction's action isn't a function", function () {
    assert.throws(function () {
      new StateHolder(
        {
          "name": 'name',
          action: "wrongOne"
        });
    });
  });
});