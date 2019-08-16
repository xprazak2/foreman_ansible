import React from 'react';
import { Spinner, Button, Icon } from 'patternfly-react';

import AnsibleVariablesTableRows from './components/AnsibleVariablesTableRows';
import GenericPopover from './components/GenericPopover';

import './styles.scss';

const AnsibleHostParams = ({ loading, assignedRoles }) => {
  const popoverText = __('Foreman will not send this paramenter in classification output');

  const popoverTitle = __('Omit parameter from classification');

  const omitHelpButton = <a href='#'><Icon type="pf" name="info" /></a>

  return (
    <div>
      <fieldset>
        <h2> {__('Ansible Variables')}</h2>
        <Spinner loading={loading}>
          <table className="table table-fixed" id="inherited_ansible_variables">
            <thead className="white-header">
              <tr>
                <th className='col-md-2'>{ __('Ansible Role') }</th>
                <th className='col-md-2'>{ __('Name') }</th>
                <th className='col-md-2'>{ __('Type') }</th>
                <th className='col-md-5'>{ __('Value') }</th>
                <th className='col-md-1 ca'>
                  {__('Omit')} <GenericPopover button={omitHelpButton}
                                               popoverText={popoverText}
                                               popoverTitle={popoverTitle}
                                               popoverId='ansible-omit-help'
                                               />
                </th>
              </tr>
            </thead>
            <tbody>
              <AnsibleVariablesTableRows assignedRoles={assignedRoles} />
            </tbody>
          </table>
        </Spinner>
      </fieldset>
      <br/>
    </div>
  );
};

export default AnsibleHostParams;
