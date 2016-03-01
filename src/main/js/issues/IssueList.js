'use strict';

import {Observable} from 'rx';
import {div, ul, li, h3, a} from '@cycle/dom';
import qs from "qs"
import isolate from '@cycle/isolate';

function main(sources) {
    const conversations = [{
        'TO_REVIEW': [{
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

  function outputIssueEntry(x) {
    const href = "#" + qs.stringify({ id: x.id })

    return li(
        a({ href }, x.id + " - " + x.subject)
    );
  }

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
