'use strict';

import {Observable} from 'rx';
import {div, ul, li, h3} from '@cycle/dom';
import isolate from '@cycle/isolate';

function main(sources) {
    const conversations = [{
        'TO_QUALIFY': [{
            'id': 'NAI-91',
            'subject': "Can't input name"
        }, {
            'id': 'FIP-A1',
            'subject': "Deploy new version on January 1st"
        }],
        'IN_PROGRESS': [{
            'id': 'HD-3',
            'subject': 'Change logo'
        }, {
            'id': 'HD-1',
            'subject': 'Release HeroesDesk'
        }],
        'ASSIGNED': [{
            'id': 'HD-12',
            'subject': 'Foo',
            state: ''
        }]
    }];
    const conversations$ = Observable
        .from(conversations);

    return {
        DOM: Observable.combineLatest(
            conversations$,
            (conversations => {
                return div([
                    h3("To qualify"),
                    ul(conversations['TO_QUALIFY'].map(x => li(x.subject))),
                    h3("In progress"),
                    ul(conversations['IN_PROGRESS'].map(x => li(x.subject))),
                    h3("Assigned to you"),
                    ul(conversations['ASSIGNED'].map(x => li(x.subject)))
                ]);
            }))
    };
}

export default (sources) => isolate(main)(sources);
