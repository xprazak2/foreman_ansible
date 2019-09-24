import React from 'react';

import { isEmpty, find } from 'lodash';

import { sprintf } from 'foremanReact/common/I18n';

import AnsibleVariableInput from './AnsibleVariableInput';

const updateFieldDisabled = (overriden, ommited) => !overriden || ommited

class AnsibleVariablesTableRow extends React.Component {
  constructor(props) {
    super(props);

    const initLookupValue = (lookupKey) => {
      if (!lookupKey.currentOverride) {
        return ({ element: 'fqdn', value: lookupKey.defaultValue, omit: false, overriden: false, defaultValue: lookupKey.defaultValue });
      }

      if (lookupKey.currentOverride.element === 'fqdn') {
        const found = find(lookupKey.overrideValues, (value) => (
          value.match === `fqdn=${lookupKey.currentOverride.elementName}`)
        );

        const override = ({ ...lookupKey.currentOverride, id: found.id, omit: found.omit, overriden: true, defaultValue: lookupKey.defaultValue });

        return override;
      }

      return lookupKey.currentOverride;
    }

    const { lookupKey, resourceError } = props;
    const lookupValue = initLookupValue(lookupKey)

    this.state = {
      fieldOverriden: resourceError ? true : lookupValue.overriden,
      fieldOmmited: resourceError ? false : lookupValue.omit,
      lookupValue: lookupValue,
      fieldValue: resourceError ? resourceError.value : (lookupValue.value ? lookupValue.value : lookupValue.defaultValue),
      fieldDisabled: resourceError ? false : updateFieldDisabled(lookupValue.overriden, lookupValue.omit),
      fieldHiddenValue: lookupKey.hiddenValue
    };
  }

  toggleOverride = () => {
    const newOverridenValue = !this.state.fieldOverriden;
    this.setState({ fieldOverriden: newOverridenValue,
                    fieldValue: newOverridenValue ? this.state.fieldValue : this.state.lookupValue.defaultValue,
                    fieldDisabled: updateFieldDisabled(!this.state.fieldOverriden, this.state.fieldOmmited) });
  }

  toggleOmit = () => {
    this.setState({ fieldOmmited: !this.state.fieldOmmited,
                    fieldDisabled: updateFieldDisabled(this.state.fieldOverriden, !this.state.fieldOmmited) });
  }

  toggleHidden = () => {
    this.setState({ fieldHiddenValue: !this.state.fieldHiddenValue });
  }

  updateFieldValue = value => {
    this.setState({ fieldValue: value });
  }

  render() {
    const { role, lookupKey, firstKey } = this.props;

    const roleNameColumn = role => {
      return (<td className="elipsis" rowSpan={role.ansibleVariables.length}>{ role.name }</td>);
    }

    const constructId = (role, lookupKey) => `ansible_role_${role.id}_params[${lookupKey.id}]`;

    const overrideFieldName = (lookupKey, attr) => `host[lookup_values_attributes][${lookupKey.id}][${attr}]`;

    const lookupKeyWarnings = (lookupKey, fieldValue, fieldDisabled) => {
      const validRes = { text: '', icon: 'info', valid: true }

      const invalidFactory = (text, msg) => ({
        text,
        icon: "error-circle-o",
        valid: false,
        msg
      });

      const validateValue = (condition, onInvalid) => {
        if (condition(lookupKey.validatorRule, fieldValue)) {
          return validRes;
        } else {
          return onInvalid;
        }
      }

      if (fieldDisabled) {
        return validRes;
      }

      if (lookupKey.required) {
        const pleaseChange = `${__("Required parameter with invalid value.")}<br/><b>${__("Please change!")}</b><br/>`;

        switch(lookupKey.validatorType) {
          case "None":
            return validateValue(
              (rule, value) => value,
              invalidFactory(
                `${__("Required parameter without value.")}<br/><b>${__("Please override!")}</b><br/>`,
                __("Value can't be blank")
              )
            )
          case "regexp": {
            return validateValue(
              (rule, value) => new RegExp(rule).test(value),
              invalidFactory(
                pleaseChange,
                sprintf(__("Invalid value, expected to match a regex: %s"), lookupKey.validatorRule)
              )
            )
          }
          case "list":
            return validateValue(
              (rule, value) => rule.split(',').find(item => item.trim() === value),
              invalidFactory(
                pleaseChange,
                sprintf(__("Invalid value, expected one of: %s"), lookupKey.validatorRule)
              )
            )
        }
      }

      if (fieldValue) {
        return validRes;
      }

      return ({ text: `${__("Optional parameter without value.")}<br/><i>${__("Still managed by Foreman, the value will be empty.")}</i><br/>`,
                icon: "warning-triangle-o",
                valid: true });
    }

    const keyWarnings = lookupKeyWarnings(lookupKey, this.state.fieldValue, this.state.fieldDisabled)

    return (
      <tr id={constructId(role, lookupKey)} className={`fields overriden`} key={lookupKey.id}>
        { firstKey && lookupKey.id === firstKey.id ? roleNameColumn(role) : null }
        <td className="elipsis param_name">{ lookupKey.parameter }</td>
        <td className="elipsis">{ lookupKey.parameterType }</td>
        <td className={ !keyWarnings.valid && !this.state.fieldDisabled ? 'has-error' : '' }>
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
                                fieldValue={this.state.fieldValue}
                                keyWarnings={keyWarnings}/>
          <span className="help-block">{keyWarnings.msg}</span>
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

export default AnsibleVariablesTableRow;
