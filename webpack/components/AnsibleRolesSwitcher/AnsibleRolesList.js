import React from 'react';

import { ListView } from 'patternfly-react';
import { sprintf } from 'jed';

import { reject } from 'lodash';

import PaginationRow from '../PaginationRow';
import AnsibleRole from './AnsibleRole';


export const listAvailableRoles = (unassignedRoles, pagination, itemCount, onPaginationChange, onAddRole) => {

  // handle no roles available
  const roles = unassignedRoles || [];

  return (
    <ListView>
      <div className="sticky-pagination">
        <PaginationRow
          viewType="list"
          itemCount={itemCount}
          pagination={pagination}
          onChange={onPaginationChange}
        />
      </div>
      { roles.map(role => <AnsibleRole id={role.id} key={role.id} role={role} icon='fa fa-plus-circle' onClick={onAddRole}/>) }
    </ListView>
  );
};

export const listAssignedRoles = (assignedRoles, pagination, itemCount, onPaginationChange, onRemoveRole) => {

  // handle no roles assigned
  const roles = assignedRoles || [];
  const directlyAssignedRoles = reject(roles, (role) => role.inherited)
  return (
    <div>
      <ListView>
        <div className="sticky-pagination sticky-pagination-grey">
          <PaginationRow
            viewType="list"
            itemCount={itemCount}
            pagination={pagination}
            onChange={onPaginationChange}
          />
        </div>
        { roles.map(role => <AnsibleRole key={role.id} role={role} icon='fa fa-minus-circle' onClick={onRemoveRole}/>) }
      </ListView>
      <div>
        { directlyAssignedRoles.map(role => <input key={role.id} type="hidden" name="host[ansible_role_ids][]" value={role.id} />) }
      </div>
    </div>
  )
};
