import { post } from 'foremanReact/redux/API';

import { ANSIBLE_ROLES_INDEX, ANSIBLE_ROLE_CONFIRM_IMPORT_PATH } from './AnsibleRolesAndVariablesConstants.js'
import { prepareResult } from './AnsibleRolesAndVariablesHelpers';

export const onSubmit = (rows, proxy) => dispatch => {
    const params = prepareResult(rows);
    dispatch(
      post({
        key: 'import_ansible_v_r',
        url: ANSIBLE_ROLE_CONFIRM_IMPORT_PATH,
        params: { changed: params, proxy },
        handleSuccess: () => {
          console.log('push')
          dispatch(push(ANSIBLE_ROLES_INDEX))
        },
      })
    );
  };
