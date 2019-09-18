import { connect } from 'react-redux';

import AnsibleHostParams from './AnsibleHostParams';
import { selectAssignedVariables, selectVariablesLoading } from '../AnsibleRolesSwitcher/AnsibleRolesSwitcherSelectors';

const mapStateToProps = state => {
  return { assignedRoles: selectAssignedVariables(state),
           loading: selectVariablesLoading(state) }
}

export default connect(mapStateToProps, {})(AnsibleHostParams);
