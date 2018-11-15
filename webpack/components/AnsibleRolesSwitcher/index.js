import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { lowerCase } from 'lodash';

import AnsibleRolesSwitcher from './AnsibleRolesSwitcher';
import * as AnsibleRolesSwitcherActions from './AnsibleRolesSwitcherActions';
import { calculateUnassignedRoles, assignedRolesPage } from './AnsibleRolesSwitcherSelectors';

const mapStateToProps = ({ foreman_ansible: { ansibleRolesSwitcher } }, ownProps) => {
  const {
    results,
    pagination,
    itemCount,
    assignedRoles,
    loading,
    assignedPagination
  } = ansibleRolesSwitcher.switcher;

  const { data: { resourceName = '' } } = ownProps;

  return ({
    results: results,
    pagination: pagination,
    itemCount: itemCount,
    loading: loading,
    assignedPagination: assignedPagination,
    assignedRolesCount: assignedRoles.length,
    resourceName: lowerCase(resourceName),
    assignedRoles: assignedRolesPage(assignedRoles, assignedPagination),
    unassignedRoles: calculateUnassignedRoles(results, assignedRoles),
    assignedFilterString: ansibleRolesSwitcher.connectedSearch.filterString
  });
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { data: { availableRolesUrl, initialAssignedRoles, inheritedRoleIds, resourceId, resourceName } } = ownProps;

  return {
    getAnsibleRoles: bindActionCreators(AnsibleRolesSwitcherActions.getAnsibleRoles,
      dispatch)(availableRolesUrl,
      initialAssignedRoles,
      inheritedRoleIds,
      resourceId,
      resourceName),
    addAnsibleRole: bindActionCreators(AnsibleRolesSwitcherActions.addAnsibleRole, dispatch),
    removeAnsibleRole: bindActionCreators(AnsibleRolesSwitcherActions.removeAnsibleRole, dispatch),
    changeAssignedPage: bindActionCreators(AnsibleRolesSwitcherActions.changeAssignedPage, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnsibleRolesSwitcher);
