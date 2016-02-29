'use strict';

import Cycle from '@cycle/core';
import {makeDOMDriver, hJSX} from '@cycle/dom';

import "../less/test.less";
import "bootstrap/less/bootstrap.less"

function main(drivers) {
  return {
    DOM: drivers.DOM.select('input').events('click')
      .map(ev => ev.target.checked)
      .startWith(false)
      .map(toggled =>
        <div>
          <input type="checkbox" /> Toggle me
          <p>{toggled ? 'ON' : 'off'}</p>
        </div>
      )
  };
}

const drivers = {
  DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);