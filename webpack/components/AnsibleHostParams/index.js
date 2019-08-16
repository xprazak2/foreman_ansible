import { connect } from 'react-redux';

import AnsibleHostParams from './AnsibleHostParams';

const mapStateToProps = ({ foremanAnsible }, ownProps) => {
  return { assignedRoles: foremanAnsible.ansibleRolesSwitcher.assignedVariables,
           loading: foremanAnsible.ansibleRolesSwitcher.loadingVariables }
}

export default connect(mapStateToProps, {})(AnsibleHostParams);
