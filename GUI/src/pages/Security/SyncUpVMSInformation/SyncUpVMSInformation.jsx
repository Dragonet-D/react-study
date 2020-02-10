import React from 'react';
import { connect } from 'dva';
import { SyncUpVMSInformation } from 'components/Security';

const SyncUp = props => {
  return <SyncUpVMSInformation {...props} />;
};
const mapStateToProps = ({ global, loading }) => {
  return {
    userId: global.userId,
    loading
  };
};
export default connect(mapStateToProps)(SyncUp);
