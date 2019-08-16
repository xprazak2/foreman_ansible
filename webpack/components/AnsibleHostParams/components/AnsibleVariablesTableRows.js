import React from 'react';
import { filter } from 'lodash';

import AnsibleVariablesTableRow from './AnsibleVariablesTableRow';

const AnsibleVariablesTableRows = ({ assignedRoles }) =>
  assignedRoles.map(role => {
    const overrideKeys = filter(role.ansibleVariables, ansibleVar => ansibleVar.override);

    const firstKey = overrideKeys[0] || {};

    return overrideKeys.map((lookupKey) =>
      (
        <AnsibleVariablesTableRow key={lookupKey.id} role={role} lookupKey={lookupKey} firstKey={firstKey} />
      )
    );
  });


export default AnsibleVariablesTableRows;
