import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';

function App() {
  return <div>app</div>;
}

const menuGlobal = [
  {
    path: '/login',
    models: () => [import('./models/login')],
    component: () => import('./pages/login')
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
            component={dynamic({
              app,
              ...dynamics
            })}
          />
        ))}
        <Route path="/" component={App} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
