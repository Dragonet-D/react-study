import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { router, dynamic } from 'dva';
import MessageCenter, { WSMessageCenter, ProgressMessageCenter } from 'components/MessageCenter';
import CodeLoading from 'components/Loading/CodeLoading';
import Authorized from './utils/Authorized';
import materialKeys from './utils/materialKeys';
import { getRouterData } from './commons/router';
import IVHTheme from './components/Theme';
import { SessionTimeout } from './components/User';

const { Route, Switch, Router, Redirect } = router;
const { AuthorizedRoute } = Authorized;

// import { dynamic } from 'dva';
dynamic.setDefaultLoadingComponent(CodeLoading);

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const Index = routerData['/'].component;
  const UserLayout = routerData['/user'].component;
  const ExceptionLayout = routerData['/exception'].component;
  const UnauthorizedLayout = routerData['/unauthorized'].component;
  const { pathname } = history.location;
  const paths = Object.keys(routerData);
  return (
    <IVHTheme>
      <DndProvider backend={HTML5Backend}>
        <Router history={history}>
          <Switch>
            {!paths.some(item => item.indexOf(pathname) === 0) && (
              <Redirect from={pathname} to="/exception/404" />
            )}
            <Route path="/user" component={UserLayout} />
            <Route path="/exception" component={ExceptionLayout} />
            <Route path="/unauthorized" component={UnauthorizedLayout} />
            <AuthorizedRoute
              path="/"
              render={props => <Index {...props} />}
              authority={Object.values(materialKeys)}
              redirectPath="/user/login"
            />
          </Switch>
        </Router>
        <MessageCenter />
        <WSMessageCenter />
        <ProgressMessageCenter />
        <SessionTimeout history={history} />
      </DndProvider>
    </IVHTheme>
  );
}

export default RouterConfig;
