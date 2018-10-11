import React from 'react';

import { Popover, OverlayTrigger, Button, Icon } from 'patternfly-react';

const keyOverlay = (lookupKey, lookupValue) => (
  <Popover id="popover" title='Original value info'>
    <div>
      <b>Description: </b> { lookupKey.description }<br/>
      <b>Type: </b> { lookupKey.parameter_type }<br/>
      <b>Matcher: </b> { formatMatcher(lookupKey.current_override) }<br/>
      <b>Inherited Value: </b> { showLookupValue(lookupKey, lookupValue) }<br/>
    </div>
  </Popover>
);

const formatMatcher = (currentOverride) =>
  (currentOverride.element + ' (' + currentOverride.element_name +')')

const keyInfoPopover = (lookupKey, lookupValue) => (
  <div style={{ textAlign: 'center' }}>
    <OverlayTrigger
      overlay={keyOverlay(lookupKey, lookupValue)}
      placement='top'
      trigger='click'
      rootClose={true}
    >
      <a href="#" className="popover-pf-info"><Icon type="pf" name="info" /></a>
    </OverlayTrigger>
  </div>
)



const buttonHelpPopover = (button, popoverText, popoverId) => (
  <div style={{ textAlign: 'center' }}>
    <OverlayTrigger
      overlay={buttonHelpOverlay(popoverText, popoverId)}
      placement='top'
      trigger='hover'
      rootClose={true}
    >
      { button }
    </OverlayTrigger>
  </div>
);

const buttonHelpOverlay = (popoverText, popoverId) => (
  <Popover id={popoverId}>
    <div>
      { popoverText }
    </div>
  </Popover>
);

export default (props) => {
  console.log('variable input props')
  console.log(props)

  const lookupKey = props.lookupKey;

  const { fieldDisabled, toggleOverride, fieldOverriden, lookupValue, updateLookupValue } = props;

  return (
    <div className='input-group'>
      <span className="input-group-addon">
        { keyInfoPopover(lookupKey, lookupValue) }
      </span>
      <textarea className="form-control no-stretch"
                rows="1"
                value={ showLookupValue(lookupKey, lookupValue) }
                name={`host[lookup_values_attributes][${lookupKey.id}][value]`}
                onChange={(e) => updateLookupValue(e.target.value)}
                disabled={fieldDisabled()}/>
      <span className="input-group-btn">
        { fullscreenButton() }
        { overrideButton(toggleOverride, fieldOverriden, lookupKey.id) }
      </span>
    </div>
  );
}

const overrideButton = (toggleField, fieldOverriden, keyId) => {
  let faIcon, popoverText, popoverId;

  if (fieldOverriden) {
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

const showLookupValue = (lookupKey, lookupValue) => lookupKey['hidden_value?'] ? lookupKey.hidden_value : lookupValue.value;

const rawLookupValue = (lookupKey) => lookupKey.override && lookupKey.current_override ? lookupKey.current_override.value : lookupKey.default_value;

// todo
const fullscreenButton = () => {
  const button = (
    <Button name="button" type="button" className="btn btn-default btn-md btn-fullscreen">
      <span className="fa fa-expand"></span>
    </Button>
  );
  return;
}
