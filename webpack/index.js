import componentRegistry from 'foremanReact/components/componentRegistry';
import injectReducer from 'foremanReact/redux/reducers/registerReducer';
import ReportJsonViewer from './components/ReportJsonViewer';
import AnsibleRolesSwitcher from './components/AnsibleRolesSwitcher';
import AnsibleHostParams from './components/AnsibleHostParams';

import reducer from './reducer';

componentRegistry.register({ name: 'ReportJsonViewer', type: ReportJsonViewer });
componentRegistry.register({ name: 'AnsibleHostParams', type: AnsibleHostParams, tags: ['HostParameters'] });
componentRegistry.register({ name: 'AnsibleRolesSwitcher', type: AnsibleRolesSwitcher });

injectReducer('foreman_ansible', reducer);
