import React from 'react';

import { isEmpty, find } from 'lodash';

import AnsibleVariableInput from './AnsibleVariableInput';

class AnsibleParamsTableRow extends React.Component {
  constructor(props) {
    super(props);

    const initOverrideState = (lookupKey) => {
      const findOverride = (lookupKey) => find(lookupKey.override_values, (value) =>
        (value.value === lookupKey.current_override.value &&
         value.match === `${lookupKey.current_override.element}=${lookupKey.current_override.element_name}`));


      const override = findOverride(lookupKey);

      if (lookupKey.current_override.element !== 'fqdn') {
        override.id = '';
      }

      return override;
    }

    this.state = {
      fieldOverriden: true,
      lookupValue: initOverrideState(props.lookupKey)
    };

    this.toggleOverride = this.toggleOverride.bind(this);
    this.toggleOmit = this.toggleOmit.bind(this);
    this.fieldDisabled = this.fieldDisabled.bind(this);
  }

  toggleOverride(){
    this.setState({ fieldOverriden: !this.state.fieldOverriden });
  }

  toggleOmit() {
    this.setState({ lookupValue: Object.assign({}, this.state.lookupValue, { omit: !this.state.lookupValue.omit }) });
  }

  fieldDisabled() {
    return this.state.fieldOverriden || this.state.fieldOmit;
  }

  updateLookupAttr = (attr) => (value) => {
    this.setState({ lookupValue: Object.assign(this.state.lookupValue, { [attr]: value } )})
  }

  render() {
    const { role, lookupKey, firstKey } = this.props;

    const overridenClass = (lookupKey) => lookupKey.override ? 'overriden' : '';

    const roleNameColumn = role => {
      return (<td className="elipsis" rowSpan={role.lookup_keys.length}>{ role.name }</td>);
    }

    const constructId = (role, lookupKey) => `ansible_role_${role.id}_params[${lookupKey.id}]`;

    const overrideFieldName = (lookupKey, attr) => `host[lookup_values_attributes][${lookupKey.id}][${attr}]`;

    const checkboxInput = <input type="checkbox"
                                 onChange={this.updateLookupAttr('omit')}
                                 defaultChecked={this.state.lookupValue.omit}
                                 name={`host[lookup_values_attributes][${lookupKey.id}][omit]`}
                                 style={{}}/>;


    return (
      <tr id={constructId(role, lookupKey)} className={`fields ${overridenClass(lookupKey)}`} key={lookupKey.id}>
        { lookupKey.id === firstKey.id ? roleNameColumn(role) : null }
        <td className="elipsis param_name">{ lookupKey.parameter }</td>
        <td className="elipsis">{ __('Ansible Variable') }</td>
        <td className={ false ? 'has-error' : '' }>
          <AnsibleVariableInput role={role}
                                lookupKey={lookupKey}
                                lookupValue={this.state.lookupValue}
                                updateLookupValue={this.updateLookupAttr('value')}
                                toggleOverride={this.toggleOverride}
                                fieldDisabled={this.fieldDisabled}
                                fieldOverriden={this.state.fieldOverriden}/>
        </td>
        <td className="ca">
          { this.state.fieldOverriden ? '' : checkboxInput }
          <input type="hidden" name={`host[lookup_values_attributes][${lookupKey.id}][lookup_key_id]`} value={lookupKey.id}/>
          <input type="hidden" name={`host[lookup_values_attributes][${lookupKey.id}][id]`} value={this.state.lookupValue.id}/>
          <input type="hidden" name={`host[lookup_values_attributes][${lookupKey.id}][_destroy]`} value={this.state.fieldOverriden}/>
        </td>
      </tr>)
  }
}

export default AnsibleParamsTableRow;
