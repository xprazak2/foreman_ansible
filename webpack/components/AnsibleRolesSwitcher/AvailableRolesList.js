import React from 'react';

import { ListView } from 'patternfly-react';
import { reject } from 'lodash';
import Pagination from 'foremanReact/components/Pagination/Pagination';
import PaginationWrapper from 'foremanReact/components/Pagination/PaginationWrapper';

import { LoadingState } from '../LoadingState';
import AnsibleRole from './AnsibleRole';
import Search from './Search';

const AvailableRolesList = ({ unassignedRoles, pagination, itemCount, onListingChange, onAddRole, loading }) => {
  const searchQueryFunc = (name) => ({ search: `name ~ ${name}`, ...pagination });

  const clearQueryFunc = () => ({ search: '', ...pagination });

  return (
    <div>
      <Search searchFunc={onListingChange}
              searchQueryFunc={searchQueryFunc}
              clearFunc={onListingChange}
              clearQueryFunc={clearQueryFunc}
              />
      <ListView>
        <div className="sticky-pagination">
          <PaginationWrapper
            viewType="list"
            itemCount={itemCount}
            pagination={pagination}
            onChange={onListingChange}
            dropdownButtonId='available-ansible-roles-pagination-row-dropdown'
          />
        </div>
        <LoadingState loading={loading} >
          { unassignedRoles.map(role => <AnsibleRole id={role.id} key={role.id} role={role} icon='fa fa-plus-circle' onClick={onAddRole}/>) }
        </LoadingState>
      </ListView>
    </div>
  );
}

export default AvailableRolesList;
