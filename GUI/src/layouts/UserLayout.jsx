import React from 'react';
import { router, connect } from 'dva';
import DocumentTitle from 'react-document-title';
import { getRoutes } from 'utils/utils';
import { Loading } from 'components/Loading';
import styles from './UserLayout.module.less';

const { Redirect, Switch, Route } = router;
class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'IVH-LOGIN';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - IVH`;
    }
    return title;
  }

  render() {
    const { routerData, match, loading } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          {loading.global && <Loading />}
          <Switch>
            {getRoutes(match.path, routerData).map(item => (
              <Route
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
              />
            ))}
            <Redirect exact from="/user" to="/user/login" />
          </Switch>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ loading }) => ({ loading }))(UserLayout);
