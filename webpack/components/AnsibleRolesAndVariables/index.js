import React from 'react';
import { useDispatch } from 'react-redux';

import ImportRolesAndVariablesTable from './AnsibleRolesAndVariables';
import { onSubmit } from './AnsibleRolesAndVariablesActions';

const WrappedImportRolesAndVariables = props => {
  const dispatch = useDispatch();
  const submit = (rows, proxy) => dispatch(onSubmit(rows, proxy));

  return (
    <ImportRolesAndVariablesTable
      {...props}
      onSubmit={submit}
    />
  )
}

export default WrappedImportRolesAndVariables;
