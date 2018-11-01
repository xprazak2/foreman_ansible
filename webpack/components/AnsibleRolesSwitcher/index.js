import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { flatMap, filter, tap, differenceBy, difference, slice, lowerCase } from 'lodash';

import AnsibleRolesSwitcher from './AnsibleRolesSwitcher';
import * as AnsibleRolesSwitcherActions from './AnsibleRolesSwitcherActions';


const mapStateToProps = ({ foreman_ansible: { ansibleRolesSwitcher } }, ownProps) => {
  const { results = [],
          pagination = {},
          itemCount = 0,
          assignedRoles = [],
          unassignedRoles = [],
          loading,
          assignedPagination = {} } = ansibleRolesSwitcher;

  const { data: { resourceName = '' } } = ownProps;

  return ({ results: results,
            pagination: pagination,
            itemCount: itemCount,
            loading: loading,
            assignedPagination: assignedPagination,
            assignedRolesCount: assignedRoles.length,
            assignedRoles: assignedRolesPage(assignedRoles, assignedPagination),
            resourceName: lowerCase(resourceName),
            unassignedRoles });
}

const assignedRolesPage = (assignedRoles, assignedPagination) => {
  const offset = (assignedPagination.page - 1) * assignedPagination.perPage;

  return slice(assignedRoles, offset, offset + assignedPagination.perPage);
}


const mapDispatchToProps = (dispatch, ownProps) => {
  const { data: { availableRolesUrl, initialAssignedRoles, inheritedRoleIds, resourceId, resourceName } } = ownProps;
  console.log(initialAssignedRoles)
  return {
    getAnsibleRoles: bindActionCreators(
      AnsibleRolesSwitcherActions.getAnsibleRoles, dispatch
    )(availableRolesUrl, initialAssignedRoles, inheritedRoleIds, resourceId, resourceName),
    addAnsibleRole: bindActionCreators(AnsibleRolesSwitcherActions.addAnsibleRole, dispatch),
    removeAnsibleRole: bindActionCreators(AnsibleRolesSwitcherActions.removeAnsibleRole, dispatch),
    changeAssignedPage: bindActionCreators(AnsibleRolesSwitcherActions.changeAssignedPage, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnsibleRolesSwitcher);
