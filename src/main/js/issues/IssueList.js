'use strict';

import {Observable} from 'rx';
import {div, ul, li, h3, a, button} from '@cycle/dom';
import qs from "qs"
import isolate from '@cycle/isolate';
import faker from "faker"

const updateIssueBy = (data, p, fn) => {
    const f = x => {
        if(p(x))
            fn(x);

        return x;
    };

    data["TO_REVIEW"].map(f);
    data["IN_PROGRESS"].map(f);
    data["ASSIGNED"].map(f);
}

function makeModification$(actions) {

    const create$ = actions.create$.map(x => data => {
        const keys = ["TO_REVIEW", "IN_PROGRESS", "ASSIGNED"];
        const randomKey = keys[Math.floor(Math.random() * keys.length)];

        data[randomKey].push({
            'id': faker.hacker.abbreviation() + '-' + faker.random.number(),
            'subject': faker.hacker.noun(),
            content: faker.lorem.sentence(50),
            state: ''
        });

        return data;
    })

    const select$ = actions.select$.map(x => data => {
        const selectedIssueId = x.target.id;

        // un-selected all issues
        updateIssueBy(data, x => true, issue => issue.isSelected = false)

        // Who needs Immutability ?
        updateIssueBy(data, x => x.id === selectedIssueId, issue => issue.isSelected = true)

        return data;
    });

    return Observable.merge(
        select$, create$
    );
}

function model(actions, data$) {

    const modification$ = makeModification$(actions);

    // RETURN THE MODEL DATA
    return data$
            .concat(modification$)
            .scan((todosData, modFn) => modFn(todosData))
            .shareReplay(1);
}

function intent(DOM) {

    return {
        select$: DOM.select('a').events("click"),
        create$: DOM.select('button').events("click"),
    };
}

function main({ DOM }) {

    const initialData = [{
        'TO_REVIEW': [{
            'id': 'NAI-91',
            'subject': "Can't input name",
            content: faker.lorem.sentence(50)
        }, {
            'id': 'FIP-A1',
            'subject': "Deploy new version on January 1st",
            content: faker.lorem.sentence(50)
        }],
        'IN_PROGRESS': [{
            'id': 'HD-3',
            'subject': 'Change logo',
            content: faker.lorem.sentence(50)
        }, {
            'id': 'HD-1',
            'subject': 'Release HeroesDesk',
            content: faker.lorem.sentence(50)
        }],
        'ASSIGNED': [{
            'id': 'HD-12',
            'subject': 'Foo',
            content: faker.lorem.sentence(50),
            state: ''
        }]
    }];

    const data$ = Observable.from(initialData);

    const actions = intent(DOM);
    const conversations$ = model(actions, data$);

    const outputIssueEntry = ({ id, subject, isSelected }) => li(
        (isSelected) ? ".bg-danger" : null,
        a("#" + id, [id + " - " + subject])
    );

  return {
        DOM: Observable.combineLatest(
            conversations$,
            (conversations => {
                return div([
                    button(".btn.btn-primary", "Add issue"),
                    h3("To review"),
                    ul(".list-unstyled", conversations['TO_REVIEW'].map(x => outputIssueEntry(x))),
                    h3("In progress"),
                    ul(".list-unstyled", conversations['IN_PROGRESS'].map(x => outputIssueEntry(x))),
                    h3("Assigned to you"),
                    ul(".list-unstyled", conversations['ASSIGNED'].map(x => outputIssueEntry(x)))
                ]);
            }))
    };
}

export default (sources) => isolate(main)(sources);
