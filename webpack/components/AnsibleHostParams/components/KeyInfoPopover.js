import React from 'react';

import { Popover, Icon } from 'patternfly-react';

import GenericPopover from './GenericPopover';


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

const showLookupValue = (hidden, lookupKey, lookupValue) => hidden ? '*****' : lookupKey.defaultValue;

const formatMatcher = (currentOverride) =>
  currentOverride ?
  (currentOverride.element + ' (' + currentOverride.elementName +')') :
  ''

// const keyInfoPopover = (lookupKey, lookupValue, hidden) => (
//   <div style={{ textAlign: 'center' }}>
//     <OverlayTrigger
//       overlay={keyOverlay(lookupKey, lookupValue, hidden)}
//       placement='top'
//       trigger='click'
//       rootClose={true}
//     >
//       <a href="#" className="popover-pf-info"><Icon type="pf" name="info" /></a>
//     </OverlayTrigger>
//   <div style={{ textAlign: 'center' }}>
//   </div>
// )

const KeyInfoPopover = ({ lookupKey, lookupValue, hidden }) => {
  const button = <a href="#" className="popover-pf-info"><Icon type="pf" name="info" /></a>;
  return (
    <div style={{ textAlign: 'center' }}>
      <GenericPopover
        popoverOverlay={keyOverlay(lookupKey, lookupValue, hidden)}
        button={button}
      />
    </div>
  );
}

export default KeyInfoPopover;
