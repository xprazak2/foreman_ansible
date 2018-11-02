import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import { listAvailableRoles, listAssignedRoles } from './AnsibleRolesList';

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
      resourceName
    } = this.props;

    const onUnassignedPaginationChange = paginationArgs => getAnsibleRoles({ ...paginationArgs });

    return (
      <Grid bsClass="container-fluid" id="ansibleRolesSwitcher">
          <Row className="row-eq-height">
            <Col sm={6} className="available-roles-container">
              <div className="available-roles-header">
                <h2>{__('Available Ansible Roles')}</h2>
              </div>
              { listAvailableRoles(unassignedRoles, pagination, itemCount, onUnassignedPaginationChange, addAnsibleRole, loading) }
            </Col>

            <Col sm={6} className="assigned-roles-container">
              <div className="assigned-roles-header">
                <h2>{__('Assigned Ansible Roles')}</h2>
              </div>
              { listAssignedRoles(assignedRoles, assignedPagination, assignedRolesCount, changeAssignedPage, removeAnsibleRole, resourceName) }
            </Col>
          </Row>
      </Grid>
    );
  }
}

export default AnsibleRolesSwitcher;
