import React from 'react';
import {
  RequestAccessHeader,
  VMSRequestAccessCreateDialog as CreateDialog
} from 'components/VMS/RequestAccess';
import { I18n } from 'react-i18nify';
import { IVHTable } from 'components/common';
import { connect } from 'dva';
import msg from 'utils/messageCenter';
import { isSuccess } from 'utils/helpers';
import { Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { VALIDMSG_NOTCHANGE } from 'commons/constants/commonConstant';

function RequestAccess(props) {
  const { VMSRequestAccess, dispatch, global } = props;
  const { requestDataSource, groupDataSource, channelData } = VMSRequestAccess;
  const { userId } = global;
  const [PopAddRequest, setPopAddRequest] = React.useState(false);
  const [itemData, setItemData] = React.useState({});
  const [operateType, setOperateType] = React.useState('');
  const [permissionList, setPermissionList] = React.useState([]);

  React.useEffect(() => {
    getRequestList();
    getChannelList();
    getGroupDataSource();
  }, []);

  function getUserPermission() {
    dispatch({
      type: 'VMSRequestAccess/getUserPermission',
      payload: { userId }
    }).then(res => {
      setPermissionList(res.data);
    });
  }

  function getRequestList() {
    dispatch({
      type: 'VMSRequestAccess/getRequestList',
      payload: { userId }
    });
  }

  function getGroupDataSource() {
    dispatch({
      type: 'VMSRequestAccess/getGroupDataSource',
      payload: { userId }
    });
  }

  function openAddRequest(type, item) {
    getUserPermission();
    setPopAddRequest(true);
    setOperateType(type);
    setItemData(item);
  }

  function closeDialog() {
    setPopAddRequest(false);
    setItemData({});
  }

  function saveRequest(obj) {
    const { dispatch, global } = props;
    if (operateType === 'create') {
      dispatch({
        type: 'VMSRequestAccess/createRequest',
        payload: {
          requestBy: global.userId,
          requestGroup: obj.checkedId,
          requestReason: obj.requestReason,
          requestStatus: 'P',
          approvedBy: '',
          startDate: '',
          endDate: '',
          channels: '',
          requestId: '',
          accessPermission: obj.permissionString,
          descriptionFields: {
            'Request By': global.userId,
            'Rquest Reason': obj.requestReason,
            'Selected Group': obj.checkedId
          }
        }
      }).then(res => {
        if (!res) return;
        if (isSuccess(res)) {
          msg.success('Created Request Successfully', 'Request Access');
          // this.handleGetDataByPage(pageNo, pageSize);
          setPopAddRequest(false);
          getRequestList();
        } else if (res) {
          msg.error(res.message, 'Request Access');
        }
      });
    }
    if (operateType === 'update') {
      if (
        itemData.requestReason === obj.requestReason &&
        itemData.requestGroupId === obj.checkedId
      ) {
        msg.warn(VALIDMSG_NOTCHANGE);
        return;
      }
      dispatch({
        type: 'VMSRequestAccess/updateRequest',
        payload: {
          userId: global.userId,
          requestId: itemData.requestId,
          requestReason: obj.requestReason,
          requestGroup: obj.checkedId,
          descriptionFields: {
            'Request By': global.userId,
            'Rquest Reason': obj.requestReason,
            'Selected Group': obj.checkedId,
            'Request Id': itemData.requestId
          }
        }
      }).then(res => {
        if (!res) return;
        if (isSuccess(res)) {
          msg.success('Updated Request Successfully', 'Request Access');
          // this.handleGetDataByPage(pageNo, pageSize);
          getRequestList();
          setPopAddRequest(false);
        } else if (res) {
          msg.error(res.message, 'Request Access');
        }
      });
    }
  }

  function getChannelList() {
    dispatch({
      type: 'VMSRequestAccess/getChannelListData',
      userId
    });
  }

  const columns = [
    {
      title: I18n.t('uvms.requestAccess.page.requestNo'),
      dataIndex: 'requestNo',
      renderItem: item => {
        if (item.requestStatusDesc === 'Pending') {
          return (
            <Link onClick={() => openAddRequest('update', item)}>
              <Typography color="secondary" component="span">
                {item.requestNo}
              </Typography>
            </Link>
          );
        }
        return item.requestNo;
      }
    },
    {
      title: I18n.t('uvms.requestAccess.page.groupName'),
      dataIndex: 'requestGroupName'
    },
    {
      title: I18n.t('uvms.requestAccess.page.requestByName'),
      dataIndex: 'requestByName'
    },
    {
      title: I18n.t('uvms.requestAccess.page.submittedDate'),
      dataIndex: 'submittedDate'
    },
    {
      title: I18n.t('uvms.requestAccess.page.requestReason'),
      dataIndex: 'requestReason'
    },
    {
      title: I18n.t('uvms.requestAccess.page.requestStatusDesc'),
      dataIndex: 'requestStatusDesc'
    }
  ];
  return (
    <React.Fragment>
      <RequestAccessHeader
        openAddRequest={() => {
          openAddRequest('create', {});
        }}
      />
      <IVHTable
        tableMaxHeight="calc(100% - 160px)"
        keyId="requestId"
        columns={columns}
        dataSource={requestDataSource || []}
      />
      {PopAddRequest && (
        <CreateDialog
          openDialog={PopAddRequest}
          closeDialog={closeDialog}
          groupData={groupDataSource || []}
          handleSubmit={saveRequest}
          itemData={itemData}
          operateType={operateType}
          channelData={channelData}
          permissionList={permissionList}
        />
      )}
    </React.Fragment>
  );
}

export default connect(({ VMSRequestAccess, global }) => ({
  VMSRequestAccess,
  global
}))(RequestAccess);
