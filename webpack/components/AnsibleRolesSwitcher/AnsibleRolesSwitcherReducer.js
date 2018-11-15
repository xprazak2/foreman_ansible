import { includes } from 'lodash';
import Immutable from 'seamless-immutable';
import { combineReducers } from 'redux';
import connectedSearch from './ConnectedSearch/ConnectedSearchReducer.js'

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
} from './AnsibleRolesSwitcherConstants';

const ansibleRolesSuccess = (state, payload) => {

  const { page, per_page, subtotal, results, initialAssignedRoles, inheritedRoleIds } = payload;

  return initAssignedRoles(state, initialAssignedRoles, inheritedRoleIds)
    .set('loading', false)
    .set('itemCount', Number(subtotal))
    .set('pagination', { page: Number(page), perPage: Number(per_page) })
    .set('results', results);
}

const initAssignedRoles = (state, initialAssignedRoles, inheritedRoleIds) => {
  if (!state.initialized) {

    const assignedRoles = initialAssignedRoles.map(role => includes(inheritedRoleIds, role.id) ?
                                                   { ...role, inherited: true } :
                                                   role);

    return state.set('assignedRoles', assignedRoles).set('initialized', true);
  }
  return state;
}

const ansibleRoleAdd = (state, payload) =>
  state.set('assignedRoles', addItem(state.assignedRoles, payload.role));

const ansibleRoleRemove = (state, payload) =>
  state.set('assignedRoles', removeItem(state.assignedRoles, payload.role));

const addItem = (list, item) => ([...(list || []), item]);

const removeItem = (list, item) => list.filter(listItem => item.id !== listItem.id);

const initialState = Immutable({
  initialized: false,
  loading: false,
  itemCount: 0,
  pagination: {
    page: 1,
    perPage: 20,
  },
  assignedRoles: [],
  results: [],
  assignedPagination: {
    page: 1,
    perPage: 20,
  },
  error: '',
});

const ansibleRoles = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case ANSIBLE_ROLES_REQUEST:
      return state.set('loading', true);
    case ANSIBLE_ROLES_SUCCESS:
      return ansibleRolesSuccess(state, payload);
    case ANSIBLE_ROLES_FAILURE:
      return state.set('loading', false).set('error': payload.error);
    case ANSIBLE_ROLES_ADD:
      return ansibleRoleAdd(state, payload);
    case ANSIBLE_ROLES_REMOVE:
      return ansibleRoleRemove(state, payload);
    case ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE:
      return state.set('assignedPagination', payload.pagination);
    default:
      return state;
  }
};

export default combineReducers({ switcher: ansibleRoles, connectedSearch });
