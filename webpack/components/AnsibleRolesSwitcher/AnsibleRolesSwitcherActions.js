import { reduce, snakeCase } from 'lodash';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
} from './AnsibleRolesSwitcherConstants';

import api from 'foremanReact/API';

export const getAnsibleRoles = (url, assignedRoleIds, inheritedRoleIds, resourceId, resourceName) => dispatch => {
  return pagination => {
    dispatch({ type: ANSIBLE_ROLES_REQUEST });

    const params = Object.assign({}, propsToSnakeCase(pagination || {}), propsToSnakeCase({ resourceId, resourceName }))

    return api.get(url, {}, params)
              .then(({ data }) => dispatch({ type: ANSIBLE_ROLES_SUCCESS,
                                             payload: Object.assign(data, { assignedRoleIds, inheritedRoleIds }) } ))
              .catch(error => dispatch({ type: ANSIBLE_ROLES_FAILURE,
                                         payload: { error } }));
  }
}

export const addAnsibleRole = role => dispatch => {
  return dispatch({ type: ANSIBLE_ROLES_ADD, payload: { role } });
}

export const removeAnsibleRole = role => dispatch => {
  return dispatch({ type: ANSIBLE_ROLES_REMOVE, payload: { role } });
}

export const changeAssignedPage = pagination => dispatch => {
  return dispatch({ type: ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE, payload: { pagination } })
}

//  stolen from katello/webpack/services/index.js and modified
const propsToSnakeCase = (ob) => {
  if (typeof (ob) !== 'object') throw Error('propsToSnakeCase only takes objects');
  return reduce(
    ob,
    (snakeOb, val, key) => {
      // eslint-disable-next-line no-param-reassign
      snakeOb[snakeCase(key)] = val;
      return snakeOb;
    },
    {},
  );
};

