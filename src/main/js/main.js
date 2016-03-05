'use strict';

import {Observable} from 'rx';
import Cycle from '@cycle/core';
import {makeDOMDriver, div, h1, header, p} from '@cycle/dom';

import "bootstrap/less/bootstrap.less"
import "../less/test.less";

import IssueList from './issues/IssueList';

const renderSidebar = (issues) => {
	return issues.map(issue => div(".div", issue))
};

const renderHeader = () => {

	return header(".navbar-header",
		p(["Heroes Desk"])
	);
}

const renderContainer = (issueList) => {

	return issueList;

	// return Observable.combineLatest(
	//     issueList.DOM,
	//     (issueListVTree => div(".well", [issueListVTree]))
	// );
}

/**
 * As React said
 *
 * v = f(data)
 *
 * Or as cycle said
 *
 * v$ = f(data$)
 *
 * state$ is the aggregate observables of our application 
 */
const view = (state$) => {

	return state$.map(({ issues, timer }) => div(".container-fluid", [
			renderHeader(),
			div(".row", [
				div(".sidebar", renderSidebar(issues)),
				div(".main", renderContainer())
			])
		])
	);
}

function main(sources) {

	const state$ = Observable.of({
		issues: IssueList(sources).DOM,
		timer: Observable.interval(1000)
	});

    const DOM = view(state$);

    return { DOM }
}

const drivers = {
    DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);