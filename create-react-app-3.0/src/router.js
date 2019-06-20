import React, { lazy, Suspense } from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';

const App = lazy(() => import('./App'));

function AAA() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  );
}

const menuGlobal = [
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
        <Route exact path="/" component={AAA} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
