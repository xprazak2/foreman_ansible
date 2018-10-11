import { reject, difference, tap, differenceBy, flatMap, filter } from 'lodash';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
} from './AnsibleRolesSwitcherConstants';

const rolesByIds = (roles, ids) => {
  return flatMap(ids || [],
    function(id) {
      return filter(roles || [],
        function (role) {
          return role.id == id;
        }
      )
    }
  );
};

const ansibleRolesSuccess = (state, payload) => {
  const { page, per_page, subtotal, results, assignedRoleIds, inheritedRoleIds } = payload;

  let assignedRoles, unassignedRoles;

  if (!state.assignedRoles && !state.unassignedRoles) {
    const assignedDirectlyIds = difference(assignedRoleIds, inheritedRoleIds);

    const assignedRolesDirectly = rolesByIds(results, assignedDirectlyIds);

    const inheritedRoles = rolesByIds(results, inheritedRoleIds).map((role) => tap(role, obj => (obj.inherited = true)));

    assignedRoles = [...assignedRolesDirectly, ...inheritedRoles];

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
  // const assignedRoles = [...(state.assignedRoles || []), payload.role];
  const assignedRoles = addItem(state.assignedRoles, payload.role);
  // const unassignedRoles =  reject(state.unassignedRoles || [], unassignedRole => (unassignedRole.id === payload.role.id));
  const unassignedRoles =  removeItem(state.unassignedRoles, payload.role);
  return { ...state, assignedRoles, unassignedRoles };
}

const ansibleRoleRemove = (state, payload) => {
  // const assignedRoles = reject(state.assignedRoles || [], assignedRole => (assignedRole.id === payload.role.id));
  const assignedRoles = removeItem(state.assignedRoles, payload.role);
  // const unassignedRoles = [...(state.unassignedRoles || []), payload.role];
  const unassignedRoles = addItem(state.unassignedRoles, payload.role);
  return { ...state, assignedRoles, unassignedRoles };
}

// add sort by ids
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
