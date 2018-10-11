import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Spinner } from 'patternfly-react';

import { reject, includes, differenceBy, filter, flatMap, tap  } from 'lodash';

import { listAvailableRoles, listAssignedRoles } from './AnsibleRolesList';

class AnsibleRolesSwitcher extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount(){
    this.props.getAnsibleRoles();
  }

  render() {
    const { loading,
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
            resourceName } = this.props;

    const onUnassignedPaginationChange = (pagination) => getAnsibleRoles({ ...pagination })

    return (
      <Grid bsClass="container-fluid">
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
