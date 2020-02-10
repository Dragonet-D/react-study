import React from 'react';
import { router } from 'dva';
import DocumentTitle from 'react-document-title';
import { getRoutes } from 'utils/utils';
import styles from './ExceptionLayout.module.less';

const { Redirect, Switch, Route } = router;

class ExceptionLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'exception-page';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - IVH`;
    }
    return title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <Switch>
            {getRoutes(match.path, routerData).map(item => (
              <Route
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
              />
            ))}
            <Redirect exact from="/exception" to="/exception/403" />
          </Switch>
        </div>
      </DocumentTitle>
    );
  }
}

export default ExceptionLayout;
