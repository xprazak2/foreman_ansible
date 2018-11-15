import Immutable from 'seamless-immutable';

import {
  CONNECTED_SEARCH_INPUT_CHANGE
} from './ConnectedSearchConstants';

const intialState = Immutable({
  filterString: ''
});

const connectedSearch = (state = intialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case CONNECTED_SEARCH_INPUT_CHANGE:
      return state.set('filterString', payload.filterString);
    default:
      return state;
  }
}

export default connectedSearch;
