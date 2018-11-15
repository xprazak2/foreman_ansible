import { differenceBy, slice } from 'lodash';

export const calculateUnassignedRoles = (results, assignedRoles) => differenceBy(results, assignedRoles, 'id');

export const assignedRolesPage = (assignedRoles, assignedPagination) => {
  const offset = (assignedPagination.page - 1) * assignedPagination.perPage;

  return slice(assignedRoles, offset, offset + assignedPagination.perPage);
};
