import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import history from '@tmp/history';


const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    "path": "/login",
    "component": require('../login').default,
    "exact": true
  },
  {
    "path": "/",
    "component": require('../../layouts').default,
    "routes": [
      {
        "path": "/",
        "component": require('../goods/index').default,
        "exact": true
      },
      {
        "path": "/about",
        "component": require('../about').default,
        "Routes": [require('../../../routes/PrivateRoute.js').default],
        "exact": true
      },
      {
        "path": "/users",
        "component": require('../users/_layout').default,
        "routes": [
          {
            "path": "/users/",
            "component": require('../users/index').default,
            "exact": true
          },
          {
            "path": "/users/:id",
            "component": require('../users/$id').default,
            "exact": true
          },
          {
            "component": () => React.createElement(require('C:/Users/D/AppData/Roaming/npm/node_modules/umi/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": require('../404').default,
        "exact": true
      },
      {
        "component": () => React.createElement(require('C:/Users/D/AppData/Roaming/npm/node_modules/umi/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('C:/Users/D/AppData/Roaming/npm/node_modules/umi/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
history.listen(routeChangeHandler);
routeChangeHandler(history.location);

export { routes };

export default function RouterWrapper() {
  return (
<Router history={history}>
      { renderRoutes(routes, {}) }
    </Router>
  );
}
