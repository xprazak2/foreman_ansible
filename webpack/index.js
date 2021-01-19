import componentRegistry from 'foremanReact/components/componentRegistry';
import injectReducer from 'foremanReact/redux/reducers/registerReducer';
import ReportJsonViewer from './components/ReportJsonViewer';
import AnsibleRolesSwitcher from './components/AnsibleRolesSwitcher';
import ImportRolesAndVariablesTable from './components/AnsibleRolesAndVariables';
import reducer from './reducer';

componentRegistry.register({
  name: 'ReportJsonViewer',
  type: ReportJsonViewer,
});
componentRegistry.register({
  name: 'AnsibleRolesSwitcher',
  type: AnsibleRolesSwitcher,
});

componentRegistry.register({
  name: 'ImportRolesAndVariablesTable',
  type: ImportRolesAndVariablesTable,
});

injectReducer('foremanAnsible', reducer);
