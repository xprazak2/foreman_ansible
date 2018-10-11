import componentRegistry from 'foremanReact/components/componentRegistry';
import ReportJsonViewer from './components/ReportJsonViewer';
import AnsibleRolesSwitcher from './components/AnsibleRolesSwitcher';

import reducer from './reducer';
import injectReducer from 'foremanReact/redux/reducers/registerReducer';

componentRegistry.register({ name: 'ReportJsonViewer', type: ReportJsonViewer });
componentRegistry.register({ name: 'AnsibleRolesSwitcher', type: AnsibleRolesSwitcher });

injectReducer('foreman_ansible', reducer);
