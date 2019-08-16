import React from 'react';

import { Popover, OverlayTrigger, Button, Icon } from 'patternfly-react';

const keyOverlay = (lookupKey, lookupValue, hidden) => (
  <Popover id="popover" title='Original value info'>
    <div>
      <b>Description: </b>{lookupKey.description}<br/>
      <b>Type: </b> {lookupKey.parameterType}<br/>
      <b>Matcher: </b>{formatMatcher(lookupKey.currentOverride)}<br/>
      <b>Inherited Value: </b>{showLookupValue(hidden, lookupKey, lookupValue)}<br/>
    </div>
  </Popover>
);

const formatMatcher = (currentOverride) =>
  currentOverride ?
  (currentOverride.element + ' (' + currentOverride.elementName +')') :
  ''

const keyInfoPopover = (lookupKey, lookupValue, hidden) => (
  <div style={{ textAlign: 'center' }}>
    <OverlayTrigger
      overlay={keyOverlay(lookupKey, lookupValue, hidden)}
      placement='top'
      trigger='click'
      rootClose={true}
    >
      <a href="#" className="popover-pf-info"><Icon type="pf" name="info" /></a>
    </OverlayTrigger>
  </div>
)

const buttonHelpPopover = (button, popoverText, popoverId) => (
    <OverlayTrigger
      overlay={buttonHelpOverlay(popoverText, popoverId)}
      placement='top'
      trigger='hover focus'
      rootClose={true}
    >
      { button }
    </OverlayTrigger>
);

const buttonHelpOverlay = (popoverText, popoverId, popoverTitle) => (
  <Popover id={popoverId} title={popoverTitle}>
    <div>
      { popoverText }
    </div>
  </Popover>
);

const AnsibleVariableInput = ({
  fieldDisabled,
  toggleOverride,
  fieldOverriden,
  lookupKey,
  lookupValue,
  fieldValue,
  updateFieldValue,
  toggleHidden,
  fieldHiddenValue }) => (
  <div className='input-group'>
    <span className="input-group-addon">
      { keyInfoPopover(lookupKey, lookupValue, fieldHiddenValue) }
    </span>
    <textarea className={`form-control no-stretch ${fieldHiddenValue ? 'masked-input' : ''}`}
              rows="1"
              value={ fieldValue }
              name={`host[lookup_values_attributes][${lookupKey.id}][value]`}
              onChange={(e) => updateFieldValue(e.target.value)}
              disabled={fieldDisabled}/>
    <span className="input-group-btn">
      { unhideButton(toggleHidden, fieldHiddenValue, lookupKey) }
      { fullscreenButton() }
      { overrideButton(toggleOverride, fieldOverriden, lookupKey.id) }
    </span>
  </div>
);

const unhideButton = (toggleHidden, hidden, lookupKey) => {
  if (!lookupKey.hiddenValue) {
    return '';
  }

  let faIcon, popoverText, popoverId;

  const keyId = lookupKey.id

  if (hidden) {
    popoverText = __('Unhide this value');
    popoverId = `lookup-key-unhide-value-${keyId}`;
  } else {
    popoverText = __('Hide this value');
    popoverId = `lookup-key-hide-value-${keyId}`;
    faIcon = 'btn-strike';
  }

  const button = (
    <Button name="button" type="button" className="btn btn-default btn-md btn-hide" onClick={toggleHidden}>
      <span className={`fa fa-font ${faIcon}`}></span>
    </Button>
  )

  return buttonHelpPopover(button, popoverText, popoverId);
}

const overrideButton = (toggleField, fieldOverriden, keyId) => {
  let faIcon, popoverText, popoverId;

  if (!fieldOverriden) {
    faIcon = 'fa-pencil-square-o';
    popoverText = __('Override this value');
    popoverId = `lookup-key-add-override-${keyId}`
  } else {
    faIcon = 'fa-times';
    popoverText = __('Remove this override');
    popoverId = `lookup-key-remove-override-${keyId}`
  }

  const button = (
    <Button name="button" type="button" className="btn btn-default btn-md btn-override" onClick={toggleField}>
      <span className={`fa ${faIcon}`}></span>
    </Button>
  );

  return buttonHelpPopover(button, popoverText, popoverId);
}

const lookupKeyWarnings = (required, hasValue) => {
  if (hasValue) {
    return ({ text: '', icon: 'info' });
  }

  if (required) {
    return ({ text: __("Required parameter without value.<br/><b>Please override!</b><br/>"),
              icon: "error-circle-o" }, lookupValue);
  }

  return ({ text: __("Optional parameter without value.<br/><i>Still managed by Foreman, the value will be empty.</i><br/>"),
            icon: "warning-triangle-o" });
}

const showLookupValue = (hidden, lookupKey, lookupValue) => hidden ? '*****' : lookupKey.defaultValue;

// todo
const fullscreenButton = () => {
  const button = (
    <Button name="button" type="button" className="btn btn-default btn-md btn-fullscreen">
      <span className="fa fa-expand"></span>
    </Button>
  );
  return;
}

export default AnsibleVariableInput;
