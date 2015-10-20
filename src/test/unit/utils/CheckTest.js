'use strict';

import assert from 'assert';
import {check} from '../../../main/js/utils/check';

describe('Check', function () {

  describe('notNull', function () {
    it("takes parameters names and values", function () {
      check.notNull({'a': 'aaa', 'b': 2});
    });
    it("throws when given null object", function () {
      assert.throws(function () {
        check.notNull(null);
      });
    });
    it("throws on one null value", function () {
      assert.throws(function () {
        check.notNull({'a': null, 'b': 2});
      });
    });
    it("throws on multiple null values", function () {
      assert.throws(function () {
        check.notNull({'a': 'Zzzz', 'b': 2, c: null, d: "nff", e: null});
      });
    });
  });

  describe('true', function () {
    it("takes a string description and a function which should be truthy", function () {
      check.true("", function () {
        return true;
      });
    });
    it("throws when no string value provided", function () {
      assert.throws(function () {
        check.true(null, function () {
          return true;
        });
      });
    });
    it("throws when no function provided", function () {
      assert.throws(function () {
        check.true("", null);
      });
    });
    it("throws when provided function not truthy", function () {
      assert.throws(function () {
        check.true("", function(){return false;});
      });
    });
  });
});

