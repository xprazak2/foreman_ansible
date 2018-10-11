import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import AnsibleHostParams from './AnsibleHostParams';

const mapStateToProps = ({ foreman_ansible }, ownProps) => {
  return { assignedRoles: foreman_ansible.ansibleRolesSwitcher.assignedRoles,
           loading: foreman_ansible.ansibleRolesSwitcher.loading }
}

export default connect(mapStateToProps, {})(AnsibleHostParams);
