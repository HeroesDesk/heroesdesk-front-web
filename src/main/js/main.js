'use strict';

import {Observable} from 'rx';
import Cycle from '@cycle/core';
import {makeDOMDriver, div} from '@cycle/dom';

import "../less/test.less";
import "bootstrap/less/bootstrap.less"

import IssueList from './issues/IssueList';

function main(sources) {
    const issueList = IssueList(sources);

    return {
        DOM: Observable.combineLatest(
            issueList.DOM,
            (issueListVTree => div(".well", [issueListVTree]))
        )
    };
}

const drivers = {
    DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);