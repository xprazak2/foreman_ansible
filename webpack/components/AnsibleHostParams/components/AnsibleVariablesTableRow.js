import React, { useState } from 'react';

import { isEmpty, find } from 'lodash';

import { sprintf } from 'foremanReact/common/I18n';

import AnsibleVariableInput from './AnsibleVariableInput';

const updateFieldDisabled = (overriden, ommited) => !overriden || ommited

const AnsibleVariablesTableRow = (props) => {
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

  const { lookupKey, resourceError, role, firstKey } = props;

  const [lookupValue, setLookupValue] = useState(initLookupValue(lookupKey));
  const [fieldOverriden, setFieldOverriden] = useState(resourceError ? true : lookupValue.overriden);
  const [fieldOmmited, setFieldOmmited] = useState(resourceError ? false : lookupValue.omit);
  const [fieldValue, setFieldValue] = useState(resourceError ? resourceError.value : (lookupValue.value ? lookupValue.value : lookupValue.defaultValue));
  const [fieldDisabled, setFieldDisabled] = useState(resourceError ? false : updateFieldDisabled(lookupValue.overriden, lookupValue.omit));
  const [fieldHiddenValue, setFieldHiddenValue] = useState(lookupKey.hiddenValue);

  const toggleOverride = () => {
    const newOverridenValue = !fieldOverriden;
    setFieldOverriden(newOverridenValue);
    setFieldValue(newOverridenValue ? fieldValue : lookupValue.defaultValue);
    setFieldDisabled(updateFieldDisabled(!fieldOverriden, fieldOmmited));
  };

  const toggleOmit = () => {
    setFieldOmmited(!fieldOmmited);
    setFieldDisabled(updateFieldDisabled(fieldOverriden, !fieldOmmited));
  };

  const toggleHidden = () => setFieldHiddenValue(!fieldHiddenValue);

  const updateFieldValue = value => setFieldValue(value);
  //

  const roleNameColumn = role => {
    return (<td className="elipsis" rowSpan={role.ansibleVariables.length}>{ role.name }</td>);
  };

  const constructId = (role, lookupKey) => `ansible_role_${role.id}_params[${lookupKey.id}]`;

  const overrideFieldName = (lookupKey, attr) => `host[lookup_values_attributes][${lookupKey.id}][${attr}]`;

  const lookupKeyWarnings = (lookupKey, fieldValue, fieldDisabled) => {
    const validRes = { text: '', icon: 'info', valid: true };

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

  const keyWarnings = lookupKeyWarnings(lookupKey, fieldValue, fieldDisabled)

  return (
    <tr id={constructId(role, lookupKey)} className={`fields overriden`} key={lookupKey.id}>
      { firstKey && lookupKey.id === firstKey.id ? roleNameColumn(role) : null }
      <td className="elipsis param_name">{ lookupKey.parameter }</td>
      <td className="elipsis">{ lookupKey.parameterType }</td>
      <td className={ !keyWarnings.valid && !fieldDisabled ? 'has-error' : '' }>
        <AnsibleVariableInput role={role}
                              lookupKey={lookupKey}
                              lookupValue={lookupValue}
                              updateFieldValue={updateFieldValue}
                              toggleOverride={toggleOverride}
                              toggleHidden={toggleHidden}
                              fieldDisabled={fieldDisabled}
                              fieldOverriden={fieldOverriden}
                              fieldOmmited={fieldOmmited}
                              fieldHiddenValue={fieldHiddenValue}
                              fieldValue={fieldValue}
                              keyWarnings={keyWarnings}/>
        <span className="help-block">{keyWarnings.msg}</span>
      </td>
      <td className="ca">
        <input type="checkbox"
               onChange={toggleOmit}
               checked={fieldOmmited}
               value={'1'}
               hidden={!fieldOverriden ? 'hidden' : undefined }
               name={`host[lookup_values_attributes][${lookupKey.id}][omit]`}
               style={{}}/>
        <input type="hidden"
               value={'0'}
               disabled={fieldOmmited || !fieldOverriden}
               name={`host[lookup_values_attributes][${lookupKey.id}][omit]`}/>

        <input type="hidden"
               name={`host[lookup_values_attributes][${lookupKey.id}][lookup_key_id]`}
               value={lookupKey.id}
               disabled={!fieldOverriden}/>
        <input type="hidden"
               name={`host[lookup_values_attributes][${lookupKey.id}][id]`}
               value={lookupValue.id}
               disabled={!fieldOverriden}/>
        <input type="hidden"
               name={`host[lookup_values_attributes][${lookupKey.id}][_destroy]`}
               value={false}
               disabled={!fieldOverriden}/>
      </td>
    </tr>
  );
};

export default AnsibleVariablesTableRow;
