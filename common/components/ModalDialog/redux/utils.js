// @flow
import identity from 'lodash/identity';
import get from 'lodash/get';

import type {Action, Reducer, NormalizedCollection, Dictionary} from '../../types';

function handleActions<S>(handlers: Dictionary<Reducer<S, Action<*>>>, defaultState: S) {
  return (state: S = defaultState, action: Action<*>) => {
    const handler = handlers[action.type];
    return typeof handler === 'function' ? handler(state, action) : state;
  };
}

export {handleActions};
