import React, { useEffect } from 'react';
import { connect } from 'dva';
import { UserGroup } from 'components/Security';

function SecurityUserGroup(props) {
  const { data, userId, dispatch } = props;
  useEffect(() => {
    dispatch({
      type: 'securityUserGroup/getTree',
      payload: {
        userId
      }
    });
  }, [userId, dispatch]);
  return <UserGroup {...data} {...props} />;
}

const mapStateToProps = ({ securityUserGroup, global, loading }) => {
  return {
    data: securityUserGroup,
    userId: global.userId,
    loading
  };
};

export default connect(mapStateToProps)(SecurityUserGroup);
