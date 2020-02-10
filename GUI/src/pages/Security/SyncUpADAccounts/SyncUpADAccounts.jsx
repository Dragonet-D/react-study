import React, { useEffect } from 'react';
import { connect } from 'dva';
import { SyncUpADAccounts } from 'components/Security';

const SyncUp = props => {
  const { dispatch, userId, data } = props;
  const { domainInfo, createdNum, updatedNum, isSuccess, isPermission } = data;
  useEffect(() => {
    dispatch({
      type: 'securitySyncUpADAccounts/getDomainInformation',
      payload: {
        userId
      }
    });
  }, []);
  return (
    <SyncUpADAccounts
      {...props}
      domainInfo={domainInfo}
      createdNum={createdNum}
      updatedNum={updatedNum}
      isSuccess={isSuccess}
      isPermission={isPermission}
    />
  );
};

const mapStateToProps = ({ securitySyncUpADAccounts, global, loading }) => {
  return {
    data: securitySyncUpADAccounts,
    userId: global.userId,
    loading
  };
};

export default connect(mapStateToProps)(SyncUp);
