import React from 'react';
import { Spinner, Button, Icon } from 'patternfly-react';

import { find, filter } from 'lodash';

import AnsibleParamsTableRow from './AnsibleParamsTableRow';
import GenericPopover from './GenericPopover';

import './styles.scss';

export default (props) => {

  const popoverText = __('Foreman will not send this paramenter in classification output');

  const popoverTitle = __('Omit parameter from classification');

  // const omitHelpButton = <Button className="popover-pf-info btn btn-link" type="button"><Icon type="pf" name="info" /></Button>
  const omitHelpButton = <a href='#'><Icon type="pf" name="info" /></a>

  const assignedRoles = props.assignedRoles || [];

  return (<div>
            <fieldset>
              <h2> { __('Ansible  Variables') }</h2>
              <Spinner loading={props.loading}>
                <table className="table table-fixed" id="inherited_ansible_variables">
                <thead className="white-header">
                  <tr>
                    <th className='col-md-2'>{ __('Ansible Role') }</th>
                    <th className='col-md-2'>{  __('Name') }</th>
                    <th className='col-md-2'>{ __('Type') }</th>
                    <th className='col-md-5'>{ __('Value') }</th>
                    <th className='col-md-1 ca'>
                      { __('Omit') } <GenericPopover button={omitHelpButton}
                                                      popoverText={popoverText}
                                                      popoverTitle={popoverTitle}
                                                      popoverId='ansible-omit-help'
                                                      placement='right'/>
                    </th>
                  </tr>
                </thead>
                  <tbody>
                    { tableBody(assignedRoles) }
                  </tbody>
              </table>
            </Spinner>
          </fieldset>
          <br/>
        </div>
  );
};

const tableBody = (assignedRoles) => {
  const markup = assignedRoles.map((role) => {

    const overrideKeys = filter(role.lookup_keys, lookupKey => lookupKey.override);

    const firstKey = overrideKeys[0] || {};

    return overrideKeys.map((lookupKey) => {

      return (
        <AnsibleParamsTableRow key={lookupKey.id} role={role} lookupKey={lookupKey} firstKey={firstKey}/>
      )
    });
  });

  return markup;
}
