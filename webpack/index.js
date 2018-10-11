import componentRegistry from 'foremanReact/components/componentRegistry';
import injectReducer from 'foremanReact/redux/reducers/registerReducer';
import ReportJsonViewer from './components/ReportJsonViewer';
import AnsibleRolesSwitcher from './components/AnsibleRolesSwitcher';
import AnsibleHostParams from './components/AnsibleHostParams';

import $ from 'jquery';

import reducer from './reducer';

componentRegistry.register({
  name: 'ReportJsonViewer',
  type: ReportJsonViewer,
});
componentRegistry.register({
  name: 'AnsibleRolesSwitcher',
  type: AnsibleRolesSwitcher,
});

componentRegistry.register({ name: 'AnsibleHostParams', type: AnsibleHostParams });

injectReducer('foremanAnsible', reducer);

window.tfm.initAnsibleRoleSwitcher = () => {
  $(document).on('ContentLoad', evt => {
    tfm.reactMounter.mount(
      'AnsibleRolesSwitcher',
      '#ansible_roles_switcher',
      $('#ansible_roles_switcher').data('roles')
    );
  });
}
