'use strict';

import {Observable} from 'rx';
import Cycle from '@cycle/core';
import {makeDOMDriver, div, h1, header, p} from '@cycle/dom';

import "bootstrap/less/bootstrap.less"
import "../less/test.less";

import IssueList from './issues/IssueList';

const renderSidebar = (time) => {
	return time.map(x => div(".text-danger", x + " s"))
};

const renderHeader = () => {

	return header(".navbar-header",
		div(".col-sm-9.col-sm-offset-3.col-md-10.col-md-offset-2", [
			p(".text-danger", "Heroes Desk of death")
		])
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
				div(".col-sm-3.col-md-2.sidebar", renderSidebar(timer)),
				div(".col-sm-9.col-sm-offset-3.col-md-10.col-md-offset-2.main", renderContainer(issues))
			])
		])
	);
}

function main(sources) {
	/**
	 * Observable for sidebar colasping
	 * @type Obervable[Boolean]
	 */
	const UIActions = Observable.of(false);

	const state$ = Observable.of({
		issues: IssueList(sources).DOM,
		timer: Observable.interval(1000),
		UIActions
	});

    const DOM = view(state$);

    return { DOM }
}

const drivers = {
    DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);