import React from 'react';

import { ListView } from 'patternfly-react';
import { reject } from 'lodash';
import PaginationRow from 'foremanReact/components/common/PaginationRow';

import { LoadingState } from '../LoadingState';
import AnsibleRole from './AnsibleRole';

export const listAvailableRoles = (unassignedRoles, pagination, itemCount, onPaginationChange, onAddRole, loading) =>
  (
    <ListView>
      <div className="sticky-pagination">
        <PaginationRow
          viewType="list"
          itemCount={itemCount}
          pagination={pagination}
          onChange={onPaginationChange}
          dropdownButtonId='available-ansible-roles-pagination-row-dropdown'
        />
      </div>
      <LoadingState loading={loading} >
        { unassignedRoles.map(role => <AnsibleRole id={role.id} key={role.id} role={role} icon='fa fa-plus-circle' onClick={onAddRole}/>) }
      </LoadingState>
    </ListView>
  );

export const listAssignedRoles = (assignedRoles, pagination, itemCount, onPaginationChange, onRemoveRole, resourceName) => {
  const directlyAssignedRoles = reject(assignedRoles, role => role.inherited);

  return (
    <div>
      <ListView>
        <div className="sticky-pagination sticky-pagination-grey">
          <PaginationRow
            viewType="list"
            itemCount={itemCount}
            pagination={pagination}
            onChange={onPaginationChange}
            dropdownButtonId='assigned-ansible-roles-pagination-row-dropdown'
          />
        </div>
        { assignedRoles.map(role => <AnsibleRole key={role.id} role={role} icon='fa fa-minus-circle' onClick={onRemoveRole}/>) }
      </ListView>
      <div>
        { directlyAssignedRoles.map(role => <input key={role.id} type="hidden" name={`${resourceName}[ansible_role_ids][]`} value={role.id} />) }
      </div>
    </div>
  );
};
