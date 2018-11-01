import { reject, tap, differenceBy, includes } from 'lodash';

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

  let assignedRoles, unassignedRoles;

  if (!state.assignedRoles && !state.unassignedRoles) {
    assignedRoles = initialAssignedRoles.map(role => (includes(inheritedRoleIds, role.id) ? tap(role, obj => (obj.inherited = true)) : role ))
  } else {
    assignedRoles = state.assignedRoles;
  }

  unassignedRoles = differenceBy(results, assignedRoles, 'id');

  return { loading: false,
           itemCount: Number(subtotal),
           pagination: { page: Number(page),
                         perPage: Number(per_page)
           },
           assignedPagination: state.assignedPagination || { page: 1, perPage: 20 },
           unassignedRoles: unassignedRoles,
           assignedRoles: assignedRoles,
           results
  }
}

const ansibleRoleAdd = (state, payload) => {
  const assignedRoles = addItem(state.assignedRoles, payload.role);
  const unassignedRoles =  removeItem(state.unassignedRoles, payload.role);
  return { ...state, assignedRoles, unassignedRoles };
}

const ansibleRoleRemove = (state, payload) => {
  const assignedRoles = removeItem(state.assignedRoles, payload.role);
  const unassignedRoles = addItem(state.unassignedRoles, payload.role);
  return { ...state, assignedRoles, unassignedRoles };
}

const addItem = (list, item) => ([...(list || []), item]);

const removeItem = (list, item) => reject(list || [], listItem => (listItem.id === item.id));

const ansibleRoles = (state = {}, action) => {
  const { payload } = action;

  switch(action.type) {
    case ANSIBLE_ROLES_REQUEST:
      return { ...state, loading: true };
    case ANSIBLE_ROLES_SUCCESS:
      return ansibleRolesSuccess(state, payload);
    case ANSIBLE_ROLES_FAILURE:
      return { ...state, ...{ error: payload.error, loading: false } };
    case ANSIBLE_ROLES_ADD:
      return ansibleRoleAdd(state, payload);
    case ANSIBLE_ROLES_REMOVE:
      return ansibleRoleRemove(state, payload);
    case ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE:
      return { ...state, ...{ assignedPagination: payload.pagination || state.assignedPagination } };
    default:
      return state;
  }
};

export default ansibleRoles;
