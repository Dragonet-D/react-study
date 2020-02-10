import React, { useState } from 'react';
import { connect, routerRedux } from 'dva';
import { UserChangePassword } from 'components/User';
import tokenHelper from 'utils/tokenHelper';
import userHelper from 'utils/userHelper';
import store from '@/index';
// import { reloadAuthorized } from 'utils/Authorized';

const ChangePassword = props => {
  // const { dispatch } = props;
  const [isOpen, setIsOpen] = useState(true);
  return (
    <UserChangePassword
      {...props}
      openChangePwdDialog={isOpen}
      handleChangePwdDialogClose={handlePasswordDialogClose}
      clearSession={logout}
    />
  );

  function handlePasswordDialogClose() {
    setIsOpen(false);
  }

  function logout() {
    // const user = JSON.parse(userHelper.get());
    // const auditUuid = user && user.auditLogId;
    // const userId = user && user.userInfo && user.userInfo.userId;
    tokenHelper.remove();
    userHelper.remove();
    store.dispatch(routerRedux.push('/user/login'));
    // reloadAuthorized();
    // window.location.reload();
    // if (auditUuid) {
    //   dispatch({
    //     type: 'global/logout',
    //     payload: {
    //       auditUuid,
    //       userId
    //     }
    //   });
    // }
  }
};

const mapStateToProps = ({ user, loading }) => {
  return {
    user,
    loading
  };
};

export default connect(mapStateToProps)(ChangePassword);
