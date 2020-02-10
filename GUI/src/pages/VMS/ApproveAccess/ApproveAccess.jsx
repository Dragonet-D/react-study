import React from 'react';
import { IVHTable, Pagination, ConfirmPage } from 'components/common';
import { connect } from 'dva';
import { Link } from '@material-ui/core';
import { PAGE_NUMBER, PAGE_SIZE, DATE_FORMAT } from 'commons/constants/const';
import { ApproveAccessHeader, RequestInfo } from 'components/VMS/ApproveAccess';
import moment from 'moment';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import msg from 'utils/messageCenter';
import { isSuccess } from 'utils/helpers';
import Typography from '@material-ui/core/Typography';

function ApproveAccess(props) {
  const { VMSApproveAccess, dispatch, global } = props;
  const { listDataSource, channelDataSource, saveRequest } = VMSApproveAccess;
  const { userId } = global;
  const [pageSize, setPageSize] = React.useState(PAGE_SIZE);
  const [pageNo, setPageNo] = React.useState(PAGE_NUMBER);
  const [filterObj, setfilterObj] = React.useState({});
  const [requestInfo, setrequestInfo] = React.useState(false);
  const [currentItem, setcurrentItem] = React.useState(false);
  // handle confirm dialog
  const [confirmType, setconfirmType] = React.useState('');
  const [confirmPageOpen, setconfirmPageOpen] = React.useState(false);
  const [params, setParams] = React.useState({});
  const [permissionList, setPermissionList] = React.useState([]);

  React.useEffect(() => {
    getChannelList({ pageNo: PAGE_NUMBER, pageSize: PAGE_SIZE });
    getApproveAccessList({ pageNo, pageSize });
  }, []);

  function getUserPermission(id) {
    dispatch({
      type: 'VMSApproveAccess/getUserPermission',
      payload: { userId: id }
    }).then(res => {
      console.log(res);
      setPermissionList(res.data);
    });
  }

  React.useEffect(() => {
    setrequestInfo(false);
  }, [saveRequest]);

  function getChannelList(obj) {
    dispatch({
      type: 'VMSApproveAccess/getChannel',
      payload: { ...obj, userId }
    });
  }

  function getApproveAccessList(obj) {
    dispatch({
      type: 'VMSApproveAccess/getApproveAccessList',
      payload: { ...obj, userId }
    });
  }

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'requestNo',
      renderItem: item => (
        <Link
          onClick={() => {
            setcurrentItem(item);
            setrequestInfo(true);
            getUserPermission(item.requestBy);
          }}
        >
          <Typography color="secondary" component="span">
            {item.requestNo}
          </Typography>
        </Link>
      )
    },
    {
      title: 'Requestor Group',
      dataIndex: 'requestorGroupname'
    },
    {
      title: 'Request By',
      dataIndex: 'requestBy'
    },
    {
      title: 'Request Date',
      dataIndex: 'submittedDate',
      render: text => moment(new Date(text)).format(DATE_FORMAT)
    },
    {
      title: 'Request Status',
      dataIndex: 'requestStatusDesc'
    },
    {
      title: 'Request Reason',
      dataIndex: 'requestComments'
    },
    {
      title: 'Action By',
      dataIndex: 'lastUpdatedId'
    }
  ];

  function requestAction() {
    dispatch({
      type: 'VMSApproveAccess/saveRequest',
      payload: params
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Operation Success', 'Approve Access');
        getApproveAccessList({ pageNo, pageSize });
        closeConfirm();
        setrequestInfo(false);
      } else if (res) {
        msg.error(res.message, 'Approve Access');
      }
    });
  }

  function onChangePage(e, page) {
    setPageNo(page);
    getApproveAccessList({ ...filterObj, pageSize, pageNo: page });
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    setPageNo(PAGE_NUMBER);
    getApproveAccessList({ ...filterObj, pageSize: value, pageNo: PAGE_NUMBER });
  }

  function onClickSearch(obj) {
    setPageNo(PAGE_NUMBER);
    if (!_.isEmpty(obj)) {
      setfilterObj(obj);
    }
    getApproveAccessList({ ...obj, pageNo: PAGE_NUMBER, pageSize });
  }

  const confirmMsgs = {
    Approve: {
      title: I18n.t('uvms.approve.approveRequest'),
      msg: I18n.t('uvms.approve.confirmToApproveRequest')
    },
    Reject: {
      title: I18n.t('uvms.approve.rejectRequest'),
      msg: I18n.t('uvms.approve.confirmToRejectRequest')
    },
    Revoke: {
      title: I18n.t('uvms.approve.revokeRequest'),
      msg: I18n.t('uvms.approve.confirmToRevokeRequest')
    }
  };

  function setconfirmOpen(type, params) {
    setconfirmType(type);
    setconfirmPageOpen(true);
    setParams(params);
  }

  const closeConfirm = () => {
    setconfirmPageOpen(false);
  };

  return (
    <React.Fragment>
      <ApproveAccessHeader onClickSearch={onClickSearch} />
      <IVHTable
        tableMaxHeight="calc(100% - 190px)"
        keyId="requestId"
        columns={columns}
        dataSource={listDataSource.items || []}
      />
      <Pagination
        page={pageNo}
        rowsPerPage={pageSize}
        count={listDataSource.totalNum || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />

      {requestInfo && (
        <RequestInfo
          itemData={currentItem}
          onClose={() => {
            setrequestInfo(false);
          }}
          channelList={channelDataSource || []}
          setconfirmPop={setconfirmOpen}
          userId={userId}
          getChannelList={getChannelList}
          permissionList={permissionList}
        />
      )}
      {confirmPageOpen && (
        <ConfirmPage
          isConfirmPageOpen={confirmPageOpen}
          message={confirmMsgs[confirmType].msg}
          messageTitle={confirmMsgs[confirmType].title}
          hanldeConfirmMessage={requestAction}
          handleConfirmPageClose={closeConfirm}
        />
      )}
    </React.Fragment>
  );
}

export default connect(({ VMSApproveAccess, global }) => ({
  VMSApproveAccess,
  global
}))(ApproveAccess);
