import React from 'react';
import { connect } from 'dva';
import { UserForgetPassword } from 'components/User';

const ForgetPassword = props => {
  return <UserForgetPassword {...props} />;
};

const mapStateToProps = ({ user, loading }) => {
  return {
    user,
    loading
  };
};

export default connect(mapStateToProps)(ForgetPassword);
