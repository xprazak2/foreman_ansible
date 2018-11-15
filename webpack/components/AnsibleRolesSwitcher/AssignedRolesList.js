import React from 'react';
import { ListView } from 'patternfly-react';
import PaginationWrapper from 'foremanReact/components/Pagination/PaginationWrapper';
import ConnectedSearch from './ConnectedSearch';
import { filter, reject } from 'lodash';

import AnsibleRole from './AnsibleRole';


class AssignedRolesList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { assignedRoles, pagination, itemCount, onPaginationChange, onRemoveRole, resourceName, assignedFilterString } = this.props;

    console.log(assignedFilterString);

    const directlyAssignedRoles = reject(assignedRoles, role => role.inherited);

    const filterPredicate = (filterString) => (role) => {
      return filterString ? role.name.match(filterString) : true;
    }

    return (
      <div>
        <ConnectedSearch />
        <ListView>
          <div className="sticky-pagination sticky-pagination-grey">
            <PaginationWrapper
              viewType="list"
              itemCount={itemCount}
              pagination={pagination}
              onChange={onPaginationChange}
              dropdownButtonId='assigned-ansible-roles-pagination-row-dropdown'
            />
          </div>
          { assignedRoles.filter(filterPredicate(assignedFilterString)).map(role => <AnsibleRole key={role.id} role={role} icon='fa fa-minus-circle' onClick={onRemoveRole}/>) }
        </ListView>
        <div>
          { directlyAssignedRoles.map(role => <input key={role.id} type="hidden" name={`${resourceName}[ansible_role_ids][]`} value={role.id} />) }
        </div>
      </div>
    );
  }
};

export default AssignedRolesList;