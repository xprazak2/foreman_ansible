import api from 'foremanReact/API';
import {
  propsToSnakeCase,
  propsToCamelCase,
} from 'foremanReact/common/helpers';

import { API_OPERATIONS } from 'foremanReact/redux/API';

import { rolesByIdSearch } from './AnsibleRolesSwitcherHelpers';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_FORM_OBJECT,
  ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
  ANSIBLE_VARIABLES_SUCCESS,
  ANSIBLE_VARIABLES_REMOVE,
} from './AnsibleRolesSwitcherConstants';

export const getAnsibleRoles = (
  url,
  initialAssignedRoles,
  inheritedRoleIds,
  resourceId,
  resourceName,
  pagination,
  search
) => async dispatch => {
  dispatch({ type: ANSIBLE_ROLES_REQUEST });

  const params = {
    ...propsToSnakeCase(pagination || {}),
    ...(search || {}),
    ...propsToSnakeCase({ resourceId, resourceName }),
  };

  try {
    const res = await api.get(url, {}, params);
    return dispatch({
      type: ANSIBLE_ROLES_SUCCESS,
      payload: {
        initialAssignedRoles,
        inheritedRoleIds,
        ...propsToCamelCase(res.data),
      },
    });
  } catch (error) {
    return dispatch(errorHandler(ANSIBLE_ROLES_FAILURE, error));
  }
};

export const getAnsibleVariables = (
  url,
  search,
  resourceName,
  resourceId,
  parentId
) => async dispatch => {
  if (!search.search) {
    return dispatch({
      type: ANSIBLE_VARIABLES_SUCCESS,
      response: { results: [] },
    });
  }

  const params = {
    ...(search || {}),
    ...propsToSnakeCase({ resourceName, resourceId, parentId }),
  };

  return dispatch({
    type: API_OPERATIONS.GET,
    payload: {
      params,
      url,
      key: 'ANSIBLE_VARIABLES',
    },
  });
};

const errorHandler = (msg, err) => {
  const { response } = err;
  const { data } = response;
  const error = {
    errorMsg: 'Failed to fetch Ansible Roles from server.',
    statusText: response.statusText,
    status: response.status,
    error: data ? data.error : {},
  };
  return { type: msg, payload: { error } };
};

export const addAnsibleRole = (
  role,
  variablesUrl,
  resourceName,
  resourceId
) => dispatch => {
  dispatch({
    type: ANSIBLE_ROLES_ADD,
    payload: { role },
  });

  const search = rolesByIdSearch([role.id]);

  getAnsibleVariables(variablesUrl, search, resourceName, resourceId)(dispatch);
};

export const removeAnsibleRole = role => dispatch => {
  dispatch({
    type: ANSIBLE_ROLES_REMOVE,
    payload: { role },
  });

  dispatch({
    type: ANSIBLE_VARIABLES_REMOVE,
    payload: { role },
  });
};

export const changeAssignedPage = pagination => ({
  type: ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
  payload: { pagination },
});

export const initFormObjectAttrs = formObject => ({
  type: ANSIBLE_ROLES_FORM_OBJECT,
  payload: { formObject },
});
