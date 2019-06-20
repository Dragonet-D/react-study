import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';

const menuGlobal = [
  {
    path: '/',
    component: () => import('./App')
  },
  {
    path: '/todo',
    models: () => [import('./models/todo')],
    component: () => import('./pages/todo')
  }
];

function RouterConfig({ history, app }) {
  return (
    <Router history={history}>
      <Switch>
        {menuGlobal.map(({ path, ...dynamics }) => (
          <Route
            key={path}
            path={path}
            exact
            component={dynamic({
              app,
              ...dynamics
            })}
          />
        ))}
      </Switch>
    </Router>
  );
}

export default RouterConfig;
