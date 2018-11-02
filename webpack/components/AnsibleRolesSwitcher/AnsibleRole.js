import React from 'react';

import { ListView } from 'patternfly-react';
import cx from 'classnames';

import './styles.scss';

const clickHandler = (onClick, role) => (event) => {
  event.preventDefault();
  onClick(role);
};


const actionButton = (icon, onClick, role) => (
  <button
    href='#'
    onClick={clickHandler(onClick, role)}
    className="role-add-remove-btn"
  >
    <i className={cx('fa-2x', icon)} />
  </button>
);

const AnsibleRole = ({ role, icon, onClick }) => {
  const disabledClass = role.inherited ? 'ansible-role-disabled' : '';
  return (
    <ListView.Item
      id={role.id}
      className={`listViewItem--listItemVariants ${disabledClass}`}
      heading={role.name}
      actions={role.inherited ? '' : actionButton(icon, onClick, role)}
      stacked
    >
    </ListView.Item>
  );
};

export default AnsibleRole;
