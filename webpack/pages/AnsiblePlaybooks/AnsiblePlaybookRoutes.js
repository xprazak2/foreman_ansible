import React from 'react';
import { Route, Switch } from 'react-router-dom';

import IndexPage from './IndexPage';

const links = [
  {
    title: 'Ansible Playbooks',
    path: 'ansible_playbooks',
    Component: IndexPage
  }
]

export default data => (
  <Switch>
    {links.map(({ path, Component }) => (
      <Route
        exact
        key={path}
        path={`/${path}`}
        render={props => <Component {...props} {...data} />}
      />
    ))}
  </Switch>
);
