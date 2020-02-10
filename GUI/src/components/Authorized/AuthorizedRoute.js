import React from 'react';
import { router } from 'dva';
import Authorized from './Authorized';

const { Redirect, Route } = router;
function AuthorizedRoute(props) {
  const { component: Component, render, authority, redirectPath, theme, ...rest } = props;
  return (
    <Authorized
      authority={authority}
      noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />}
    >
      <Route
        {...rest}
        render={props => (Component ? <Component {...props} theme={theme} /> : render(props))}
      />
    </Authorized>
  );
}

export default AuthorizedRoute;
