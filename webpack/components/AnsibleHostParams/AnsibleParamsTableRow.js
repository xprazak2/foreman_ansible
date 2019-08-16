import React from 'react';

import { isEmpty, find } from 'lodash';

import AnsibleVariableInput from './AnsibleVariableInput';

const updateFieldDisabled = (overriden, ommited) => !overriden || ommited

class AnsibleParamsTableRow extends React.Component {
  constructor(props) {
    super(props);

    const initLookupValue = (lookupKey) => {
      if (!lookupKey.current_override) {
        return ({ element: 'fqdn', value: lookupKey.default_value, omit: false, overriden: false, defaultValue: lookupKey.default_value });
      }

      if (lookupKey.current_override.element === 'fqdn') {
        const found = find(lookupKey.override_values, (value) => (
          // value.value === lookupKey.current_override.value &&
          value.match === `fqdn=${lookupKey.current_override.element_name}`)
        );

        const override = ({ ...lookupKey.current_override, id: found.id, omit: found.omit, overriden: true, defaultValue: lookupKey.default_value });

        // if (lookupKey['hidden_value?']) {
        //   override.hidden_value = found.value;
        // }
        return override;
      }

      return lookupKey.current_override;
    }

    const { lookupKey } = props;
    const lookupValue = initLookupValue(lookupKey)

    this.state = {
      fieldOverriden: lookupValue.overriden,
      fieldOmmited: lookupValue.omit,
      lookupValue: lookupValue,
      fieldValue: lookupValue.value ? lookupValue.value : lookupValue.defaultValue,
      fieldDisabled: updateFieldDisabled(lookupValue.overriden, lookupValue.omit),
      fieldHiddenValue: lookupKey['hidden_value?']
    };

    this.toggleOverride = this.toggleOverride.bind(this);
    this.toggleOmit = this.toggleOmit.bind(this);
    this.toggleHidden = this.toggleHidden.bind(this);
  }

  toggleOverride(){
    const newOverridenValue = !this.state.fieldOverriden;
    this.setState({ fieldOverriden: newOverridenValue,
                    fieldValue: newOverridenValue ? this.state.fieldValue : this.state.lookupValue.defaultValue,
                    fieldDisabled: updateFieldDisabled(!this.state.fieldOverriden, this.state.fieldOmmited) });
  }

  toggleOmit() {
    this.setState({ fieldOmmited: !this.state.fieldOmmited,
                    fieldDisabled: updateFieldDisabled(this.state.fieldOverriden, !this.state.fieldOmmited) });
  }

  toggleHidden() {
    this.setState({ fieldHiddenValue: !this.state.fieldHiddenValue });
  }

  updateFieldValue = value => {
    this.setState({ fieldValue: value });
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
        <td className="elipsis">{ lookupKey.parameter_type }</td>
        <td className={ false ? 'has-error' : '' }>
          <AnsibleVariableInput role={role}
                                lookupKey={lookupKey}
                                lookupValue={this.state.lookupValue}
                                updateFieldValue={this.updateFieldValue}
                                toggleOverride={this.toggleOverride}
                                toggleHidden={this.toggleHidden}
                                fieldDisabled={this.state.fieldDisabled}
                                fieldOverriden={this.state.fieldOverriden}
                                fieldOmmited={this.state.fieldOmmited}
                                fieldHiddenValue={this.state.fieldHiddenValue}
                                fieldValue={this.state.fieldValue}/>
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
