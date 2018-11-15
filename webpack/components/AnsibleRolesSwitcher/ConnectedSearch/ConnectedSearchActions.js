import {
  CONNECTED_SEARCH_INPUT_CHANGE
} from './ConnectedSearchConstants';


export const filterInputChange = filterString => dispatch =>
  dispatch({ type: CONNECTED_SEARCH_INPUT_CHANGE, payload: { filterString } });
