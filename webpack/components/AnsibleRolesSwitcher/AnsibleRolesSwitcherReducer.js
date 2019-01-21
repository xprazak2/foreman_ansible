import { includes } from 'lodash';
import Immutable from 'seamless-immutable';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
} from './AnsibleRolesSwitcherConstants';

const ansibleRolesSuccess = (state, payload) => {
  const {
    page,
    perPage,
    subtotal,
    results,
    initialAssignedRoles,
    inheritedRoleIds,
  } = payload;

  return initAssignedRoles(state, initialAssignedRoles, inheritedRoleIds)
    .set('loading', false)
    .set('itemCount', Number(subtotal))
    .set('pagination', { page: Number(page), perPage: Number(perPage) })
    .set('results', results);
};

const initAssignedRoles = (state, initialAssignedRoles, inheritedRoleIds) => {
  if (!state.initialized) {
    const assignedRoles = initialAssignedRoles.map(role => (
      includes(inheritedRoleIds, role.id) ?
        { ...role, inherited: true } :
        role
    ));

    return state.set('assignedRoles', assignedRoles).set('initialized', true);
  }
  return state;
};

const ansibleRoleAdd = (state, payload) =>
  state.set('assignedRoles', addItem(state.assignedRoles, payload.role))
       .set('itemCount', state.itemCount - 1);

const ansibleRoleRemove = (state, payload) =>
  state.set('assignedRoles', removeItem(state.assignedRoles, payload.role))
       .set('itemCount', state.itemCount + 1);

const addItem = (list, item) => ([...(list || []), item]);

const removeItem = (list, item) => list.filter(listItem => item.id !== listItem.id);

export const initialState = Immutable({
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
  error: { errorMsg: '', status: '', statusText: '' },
});

const ansibleRoles = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case ANSIBLE_ROLES_REQUEST:
      return state.set('loading', true);
    case ANSIBLE_ROLES_SUCCESS:
      return ansibleRolesSuccess(state, payload);
    case ANSIBLE_ROLES_FAILURE:
      return state.set('error', payload.error).set('loading', false);
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

export default ansibleRoles;
