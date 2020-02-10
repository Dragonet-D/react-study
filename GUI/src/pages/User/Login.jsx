import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Login as LoginPage } from 'components/User';

const Login = props => {
  return (
    <Fragment>
      <LoginPage {...props} />
    </Fragment>
  );
};

export default connect(({ user, loading }) => ({
  user,
  loading
}))(Login);
