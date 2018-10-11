import React from 'react';

import { isEmpty, find } from 'lodash';

import AnsibleVariableInput from './AnsibleVariableInput';

const updateFieldDisabled = (overriden, ommited) => !overriden || ommited

class AnsibleParamsTableRow extends React.Component {
  constructor(props) {
    super(props);

    const initLookupValue = (lookupKey) => {
      console.log('current_override')
      console.log(lookupKey.current_override)
      console.log(lookupKey.override_values)
      if (!lookupKey.current_override) {
        return ({ element: 'fqdn', value: lookupKey.default_value, omit: false });
      }

      if (lookupKey.current_override.element === 'fqdn') {
        const found = find(lookupKey.override_values, (value) => (
          // value.value === lookupKey.current_override.value &&
          value.match === `fqdn=${lookupKey.current_override.element_name}`)
        );

        const override = ({ ...lookupKey.current_override, id: found.id, element: 'fqdn', omit: found.omit });

        if (lookupKey['hidden_value?']) {
          override.hidden_value = found.value
        }
        return override;
      }

      return lookupKey.current_override;
    }

    const { lookupKey } = props;
    const lookupValue = initLookupValue(lookupKey)
    const fieldOverriden = lookupValue.element === 'fqdn';
    const fieldOmmited = !!lookupKey.omit || lookupValue.omit;

    this.state = {
      fieldOverriden: fieldOverriden,
      fieldOmmited: fieldOmmited,
      lookupValue: lookupValue,
      fieldDisabled: updateFieldDisabled(fieldOverriden, fieldOmmited),
      fieldHidden: lookupKey['hidden_value?']
    };

    this.toggleOverride = this.toggleOverride.bind(this);
    this.toggleOmit = this.toggleOmit.bind(this);
    this.toggleHidden = this.toggleHidden.bind(this);
  }

  toggleOverride(){
    this.setState({ fieldOverriden: !this.state.fieldOverriden,
                    fieldDisabled: updateFieldDisabled(!this.state.fieldOverriden, this.state.fieldOmmited) });
  }

  toggleOmit() {
    this.setState({ fieldOmmited: !this.state.fieldOmmited,
                    fieldDisabled: updateFieldDisabled(this.state.fieldOverriden, !this.state.fieldOmmited) });
  }

  toggleHidden() {
    this.setState({ fieldHidden: !this.state.fieldHidden });
  }

  updateLookupAttr = (attr) => (value) => {
    this.setState({ lookupValue: Object.assign(this.state.lookupValue, { [attr]: value } )})
  }

  render() {
    const { role, lookupKey, firstKey } = this.props;

    const roleNameColumn = role => {
      return (<td className="elipsis" rowSpan={role.ansible_variables.length}>{ role.name }</td>);
    }

    const constructId = (role, lookupKey) => `ansible_role_${role.id}_params[${lookupKey.id}]`;

    const overrideFieldName = (lookupKey, attr) => `host[lookup_values_attributes][${lookupKey.id}][${attr}]`;

    return (
      <tr id={constructId(role, lookupKey)} className={`fields overriden`} key={lookupKey.id}>
        { firstKey && lookupKey.id === firstKey.id ? roleNameColumn(role) : null }
        <td className="elipsis param_name">{ lookupKey.parameter }</td>
        <td className="elipsis">{ __('Ansible Variable') }</td>
        <td className={ false ? 'has-error' : '' }>
          <AnsibleVariableInput role={role}
                                lookupKey={lookupKey}
                                lookupValue={this.state.lookupValue}
                                updateLookupValue={this.updateLookupAttr('value')}
                                toggleOverride={this.toggleOverride}
                                toggleHidden={this.toggleHidden}
                                fieldDisabled={this.state.fieldDisabled}
                                fieldOverriden={this.state.fieldOverriden}
                                fieldOmmited={this.state.fieldOmmited}
                                fieldHidden={this.state.fieldHidden}/>
        </td>
        <td className="ca">
          <input type="checkbox"
                 onChange={this.toggleOmit}
                 checked={this.state.fieldOmmited}
                 value={'1'}
                 hidden={!this.state.fieldOverriden ? 'hidden' : undefined }
                 name={`host[lookup_values_attributes][${lookupKey.id}][omit]`}
                 style={{}}/>
          <input type="hidden"
                 value={'0'}
                 disabled={this.state.fieldOmmited || !this.state.fieldOverriden}
                 name={`host[lookup_values_attributes][${lookupKey.id}][omit]`}/>

          <input type="hidden"
                 name={`host[lookup_values_attributes][${lookupKey.id}][lookup_key_id]`}
                 value={lookupKey.id}
                 disabled={!this.state.fieldOverriden}/>
          <input type="hidden"
                 name={`host[lookup_values_attributes][${lookupKey.id}][id]`}
                 value={this.state.lookupValue.id}
                 disabled={!this.state.fieldOverriden}/>
          <input type="hidden"
                 name={`host[lookup_values_attributes][${lookupKey.id}][_destroy]`}
                 value={false}
                 disabled={!this.state.fieldOverriden}/>
        </td>
      </tr>)
  }
}

export default AnsibleParamsTableRow;
