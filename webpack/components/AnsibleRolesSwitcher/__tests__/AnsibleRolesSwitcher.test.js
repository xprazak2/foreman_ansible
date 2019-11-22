import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import AnsibleRolesSwitcher from '../AnsibleRolesSwitcher';

jest.mock('foremanReact/components/Pagination/PaginationWrapper');

const noop = () => {};

const fixtures = {
  'should render': {
    loading: false,
    pagination: { page: 1, perPage: 12 },
    itemCount: 20,
    addAnsibleRole: noop,
    removeAnsibleRole: noop,
    getAnsibleRoles: noop,
    changeAssignedPage: noop,
    assignedPagination: { page: 1, perPage: 12 },
    assignedRolesCount: 2,
    assignedRoles: [],
    allAssignedRoles: [],
    unassignedRoles: [],
    initialAssignedRoles: [],
    inheritedRoleIds: [],
    resourceName: 'Host',
    resourceId: 15,
    variablesUrl: '/hosts/14/variables',
    error: { statusText: '', errorMsg: '' },
    availableRolesUrl: 'http://test/roles',
    initFormObjectAttrs: noop,
    getAnsibleVariables: noop,
  },
};

describe('AnsibleRolesSwitcher', () =>
  testComponentSnapshotsWithFixtures(AnsibleRolesSwitcher, fixtures));
