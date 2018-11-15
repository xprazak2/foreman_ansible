import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import AvailableRolesList from './AvailableRolesList';
import AssignedRolesList from './AssignedRolesList';

class AnsibleRolesSwitcher extends React.Component {
  componentDidMount() {
    this.props.getAnsibleRoles();
  }

  render() {
    const {
      loading,
      pagination,
      itemCount,
      addAnsibleRole,
      removeAnsibleRole,
      getAnsibleRoles,
      changeAssignedPage,
      assignedPagination,
      assignedRolesCount,
      assignedRoles,
      unassignedRoles,
      resourceName,
      assignedFilterString,
    } = this.props;

    const onListingChange = args => getAnsibleRoles({ ...args });

    return (
      <Grid bsClass="container-fluid" id="ansibleRolesSwitcher">
          <Row className="row-eq-height">
            <Col sm={6} className="available-roles-container">
              <div className="available-roles-header">
                <h2>{__('Available Ansible Roles')}</h2>
              </div>
            <AvailableRolesList unassignedRoles={unassignedRoles}
                                pagination={pagination}
                                itemCount={itemCount}
                                onListingChange={onListingChange}
                                onAddRole={addAnsibleRole}
                                loading={loading} />
            </Col>

            <Col sm={6} className="assigned-roles-container">
              <div className="assigned-roles-header">
                <h2>{__('Assigned Ansible Roles')}</h2>
              </div>
              <AssignedRolesList assignedRoles={assignedRoles}
                                 pagination={assignedPagination}
                                 itemCount={assignedRolesCount}
                                 onPaginationChange={changeAssignedPage}
                                 onRemoveRole={removeAnsibleRole}
                                 resourceName={resourceName}
                                 assignedFilterString={assignedFilterString} />
            </Col>
          </Row>
      </Grid>
    );
  }
}

export default AnsibleRolesSwitcher;
