import React, { useEffect } from 'react';
import { connect } from 'dva';
import { UserManagement } from 'components/Security';

const User = props => {
  const moduleName = 'securityUserManagement';
  const { userList, roleList, dispatch } = props;

  useEffect(() => {
    dispatch({
      type: `${moduleName}/getUserListData`,
      payload: {
        obj: {
          pageNo: 0,
          pageSize: 5,
          searchUserId: props.userId
        }
      }
    });
    dispatch({
      type: `${moduleName}/getUserListData`,
      payload: {
        obj: {
          pageNo: 0,
          pageSize: 5,
          searchUserId: props.userId
        }
      }
    });
  }, []);
  return <UserManagement users={userList} userRoles={roleList} {...props} />;
};

const mapStateToProps = ({ securityUserManagement, global, loading }) => {
  return {
    userList: securityUserManagement.userList,
    roleList: securityUserManagement.roleList,
    userId: global.userId,
    loading
  };
};

export default connect(mapStateToProps)(User);
