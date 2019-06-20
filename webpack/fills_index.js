import React from 'react';

import { AddGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';

const TestAnsible = () => <div>Yuhu!</div>

console.log('fills_index');

AddGlobalFill('hostsFormSlot', 'ansibleFill', <TestAnsible key='1' />, 100);
