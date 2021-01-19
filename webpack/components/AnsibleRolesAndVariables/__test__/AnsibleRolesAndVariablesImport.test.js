import ImportRolesAndVariablesTable from '../AnsibleRolesAndVariables';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { mount } from '@theforeman/test';

const mockStore = configureMockStore([]);
const store = mockStore({});


const rowsData =  [
  {
    cells: ["bennojoy.ntp", "Update Role Variables", "Add: 1 Remove: 2 ", "", ""],
    kind: "old",
    id: "bennojoy.ntp"},
  {
    cells:["0ta2.git_role", "Import Role ", "Add: 5 ", "", ""],
    kind: "new",
    id: "0ta2.git_role"
  }];

const columnsData =  [{title: "Name"}, {title:"Operation"}, {title:"Variables"}, {title: "Hosts Count"}, {title:"Hostgroups count"}];


describe('ImportRolesAndVariablesTable', () => {
  it('rendring', () => {
    const component = mount(
      <Provider store={store}>
        <ImportRolesAndVariablesTable rowsData={rowsData} columnsData={columnsData}/>
      </Provider>
  );
    expect(component).toMatchSnapshot();
  });
});
