import React, { useEffect } from 'react';
import { connect } from 'dva';
import { RoleManagement } from 'components/Security';

const Role = props => {
  const { roleData, featureData, featureTreeData, addRoleIsSuccess, dispatch, userId } = props;
  useEffect(() => {
    dispatch({
      type: 'securityRoleManagement/getRoleData',
      payload: {
        obj: {
          pageNo: 0,
          pageSize: 5,
          userId
        }
      }
    });
  }, []);

  return (
    <RoleManagement
      roleList={roleData}
      featureList={featureData}
      featureListTree={featureTreeData}
      addRoleIsSuccess={addRoleIsSuccess}
      {...props}
    />
  );
};

const mapStateToProps = ({ securityRoleManagement, global, loading }) => {
  return {
    roleData: securityRoleManagement.roleData,
    featureData: securityRoleManagement.featureData,
    featureTreeData: securityRoleManagement.featureTreeData,
    addRoleIsSuccess: securityRoleManagement.addRoleIsSuccess,
    userId: global.userId,
    moduleName: securityRoleManagement.namespace,
    loading
  };
};

export default connect(mapStateToProps)(Role);
