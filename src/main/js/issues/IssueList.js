'use strict';

import {Observable} from 'rx';
import {div, ul, li, h3, a} from '@cycle/dom';
import qs from "qs"
import isolate from '@cycle/isolate';
import faker from "faker"

const updateIssueById = (data, id, fn) => {
    const f = x => {
        if(x.id === id)
            fn(x);

        return x;
    };

    data["TO_REVIEW"].map(f);
    data["IN_PROGRESS"].map(f);
    data["ASSIGNED"].map(f);
}

function model(actions, data) {
    const select$ = actions.select$.map(x => {
        const selectedIssueId = x.target.id;

        // I don't understand why data is an nested object yet
        data = data[0];

        // Who needs Immutability ?
        updateIssueById(data, selectedIssueId, issue => issue.isSelected = true)

        return data;
    });

    /**
     * Should be the initial data
     * @type Observable[Array]
     */
    const data$ = Observable.from(data);

    return Observable.merge(select$, data$);
}

function intent(DOM) {

    return {
        select$: DOM.select('a').events("click")
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

    const actions = intent(DOM);
    const conversations$ = model(actions, initialData);

    const outputIssueEntry = ({ id, subject, isSelected }) => li(
        (isSelected) ? ".bg-danger" : null,
        a("#" + id, [id + " - " + subject])
    );

  return {
        DOM: Observable.combineLatest(
            conversations$,
            (conversations => {
                return div([
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
