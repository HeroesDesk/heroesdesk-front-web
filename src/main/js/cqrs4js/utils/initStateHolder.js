'use strict';

import {ObjectUtils} from './../../utils/ObjectUtils'
import {check} from './../../utils/check';

export const initStateHolder = (listenedNamesAndActions) => {
  check.true("listenedNamesAndActions should contain at least one name and action", () => {
    return listenedNamesAndActions != null && listenedNamesAndActions.length != 0;
  });

  listenedNamesAndActions.forEach((actionAndName) => {
    const name = actionAndName.name;
    const action = actionAndName.action;

    check.true("Name missing", () => {
        return typeof name === "string";
      }
    );

    check.true("Action missing for name '" + name + "'", () => {
        return action instanceof Function;
      }
    );

  });
  return (state) => {
    return ObjectUtils.freezeDeep(state);
  };

};