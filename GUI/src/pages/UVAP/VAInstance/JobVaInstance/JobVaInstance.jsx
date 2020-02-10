/* eslint-disable no-unused-vars */
import React, { Fragment, useState, useReducer, useEffect, useCallback } from 'react';
import {
  OperationTableMenu,
  JobVaInstanceEditDialog,
  VapVAInstanceDetailsDialog
} from 'components/UVAP';
import moment from 'moment';
import { Pagination, IVHTable, ConfirmPage, TableToolbar } from 'components/common';
import { PAGE_NUMBER, PAGE_SIZE, DATE_FORMAT } from 'commons/constants/const';
import { makeStyles, Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { I18n } from 'react-i18nify';
import { connect } from 'dva';
import IconButton from '@material-ui/core/IconButton';
import _ from 'lodash';
import { PlayArrow, Stop, LibraryAdd } from '@material-ui/icons';
import { dataUpdatedHandle } from 'utils/helpers';
import Tooltip from '@material-ui/core/Tooltip';
import { handleInstanceList, INSTANCE_STATUS_START, INSTANCE_STATUS_STOP } from '../util';

const useStyles = makeStyles(theme => {
  return {
    toolbar_wrapper: {
      position: 'relative'
    },
    add_alarm: {
      marginLeft: 'auto',
      marginRight: '8px'
    },
    statusTab: {
      display: 'flex',
      flexDirection: 'column'
    },
    messageTab: {
      fontSize: '85%',
      marginTop: theme.spacing(0.5)
    }
  };
});
const pageInfoReducer = (pageInfo, action) => {
  switch (action.type) {
    case 'pageNo':
      return { ...pageInfo, pageNo: action.data };
    case 'pageSize':
      return { ...pageInfo, pageSize: action.data };
    // case 'totalNum':
    //   return { ...pageInfo, totalNum: action.data || 0 };
    default:
      throw new Error();
  }
};
function JobVaInstance(props) {
  const classes = useStyles();
  const { dispatch, global, JobVaInstance } = props;
  const { userId, commonWebsocketData } = global;
  const { instanceData, namespace, instanceDetails, statusList, priorityList } = JobVaInstance;
  const moduleName = namespace;
  // page info
  const [pageInfo, dispatchPageInfo] = useReducer(pageInfoReducer, {
    pageNo: PAGE_NUMBER,
    pageSize: PAGE_SIZE
  });
  const [totalNum, setTotalNum] = useState(0);
  // data init
  const [dataSource, setDataSource] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  // confirm init
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMsg, setConfirmMsg] = useState('');
  const [confirmType, setConfirmType] = useState('');
  const [currentData, setCurrentData] = useState({});
  // edit dialog init
  const [editDialogType, setEditDialogType] = useState('');
  const [editDialogStatus, setEditDialogStatus] = useState(false);

  // details dialog
  const [instanceDetailsStatus, setInstanceDetailsStatus] = useState(false);
  const [detailsList, setDetailsList] = useState([]);

  // page func
  function onChangePage(e, page) {
    dispatchPageInfo({ type: 'pageNo', data: page });
    // setSearchParams({});
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    dispatchPageInfo({ type: 'pageSize', data: value });
    // setSearchParams({});
  }
  // table columns setting
  const columns = [
    {
      title: I18n.t('vap.table.engines.status'),
      dataIndex: 'status',
      tooltipTitle: 'status.message',
      render: status => (
        <div className={classes.statusTab}>
          <span>
            {_.findIndex(statusList, { codeValue: status.name }) >= 0
              ? statusList[_.findIndex(statusList, { codeValue: status.name })].codeDesc
              : ''}
          </span>
          {status.message ? <span className={classes.messageTab}>{status.message}</span> : ''}
        </div>
      )
    },
    {
      title: I18n.t('vap.table.instance.name'),
      dataIndex: 'name',
      renderItem: item => (
        <Link onClick={() => handleGetCurrentDetails(item)}>
          <Typography color="secondary" component="span">
            {item.name}
          </Typography>
        </Link>
      )
    },
    {
      title: I18n.t('vap.table.instance.appName'),
      dataIndex: 'appName'
    },
    {
      title: I18n.t('vap.table.instance.priority'),
      dataIndex: 'priority',
      render: priority => (
        <span>
          {_.findIndex(priorityList, { codeValue: priority }) >= 0
            ? priorityList[_.findIndex(priorityList, { codeValue: priority })].codeDesc
            : ''}
        </span>
      )
    },
    {
      title: I18n.t('vap.table.instance.created'),
      dataIndex: 'created',
      render: text => <span>{moment(_.toNumber(text)).format(DATE_FORMAT)}</span>
    }
  ];
  // table operation menu setting
  const opertayionMenu = {
    tipName: I18n.t('vap.table.common.operationMenu.tipName'),
    titleName: I18n.t('vap.table.common.operationMenu.name'),
    icon: 'MoreVert',
    items: [
      {
        icon: 'Tune',
        title: I18n.t('vap.table.instance.operationMenu.update'),
        action: 'update'
      },
      {
        icon: 'PlayArrow',
        title: I18n.t('vap.table.instance.operationMenu.start'),
        dataIndex: 'status.name',
        data: INSTANCE_STATUS_START,
        action: 'start'
      },
      {
        icon: 'Stop',
        title: I18n.t('vap.table.instance.operationMenu.stop'),
        dataIndex: 'status.name',
        data: INSTANCE_STATUS_STOP,
        action: 'stop'
      },
      {
        icon: 'Delete',
        title: I18n.t('vap.table.instance.operationMenu.delete'),
        action: 'delete'
      }
    ]
  };
  function handleActions(target, data) {
    switch (target) {
      case 'update':
        setEditDialogType('update');
        getInstanceDetails(data);
        setCurrentData(data);
        setEditDialogStatus(true);
        break;
      case 'start':
        setConfirmType('start');
        setCurrentData(data);
        setConfirmTitle(I18n.t('vap.confirm.instance.job.startTitle'));
        setConfirmMsg(I18n.t('vap.confirm.instance.job.startMsg'));
        setConfirmDialog(true);
        break;
      case 'stop':
        setConfirmType('stop');
        setCurrentData(data);
        setConfirmTitle(I18n.t('vap.confirm.instance.job.stopTitle'));
        setConfirmMsg(I18n.t('vap.confirm.instance.job.stopMsg'));
        setConfirmDialog(true);
        break;
      case 'delete':
        setConfirmType('delete');
        setCurrentData(data);
        setConfirmTitle(I18n.t('vap.confirm.instance.job.deleteTitle'));
        setConfirmMsg(I18n.t('vap.confirm.instance.job.deleteMsg'));
        setConfirmDialog(true);
        break;
      default:
        break;
    }
  }
  const ExtraCell = item => {
    const { id, status } = item;
    const btnStatus = _.indexOf(INSTANCE_STATUS_START, status.name) >= 0;
    return (
      <Fragment>
        <IconButton onClick={() => handleActions(btnStatus ? 'start' : 'stop', item)}>
          {btnStatus ? <PlayArrow /> : <Stop />}
        </IconButton>
        <OperationTableMenu
          columns={opertayionMenu}
          key={id}
          itemId={id}
          currentData={item}
          getActionData={handleActions}
        />
      </Fragment>
    );
  };
  const extraCell = {
    columns: [
      {
        title: I18n.t('vap.table.common.operation'),
        dataIndex: ''
      }
    ],
    components: [
      {
        component: ExtraCell,
        key: '12'
      }
    ]
  };
  // comfirm dialog setting
  function confirmActions() {
    switch (confirmType) {
      case 'delete':
        deleteInstance({ id: currentData.instanceId });
        setConfirmDialog(false);
        setConfirmType('');
        break;
      case 'start':
        startInstance({ id: currentData.instanceId });
        setConfirmDialog(false);
        setConfirmType('');
        break;
      case 'stop':
        stopInstance({ id: currentData.instanceId });
        setConfirmDialog(false);
        setConfirmType('');
        break;
      default:
        break;
    }
  }
  // normal func
  function handleOpenCreateDialog() {
    setEditDialogType('create');
    setCurrentData({});
    setEditDialogStatus(true);
  }
  function closeEditDialog() {
    setEditDialogType('');
    setCurrentData({});
    setEditDialogStatus(false);
  }
  // dispatch func
  const getInstanceList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getInstanceList`,
        payload: {
          userId,
          ...pageInfo,
          param: searchParams,
          ...obj
        }
      });
    },
    [dispatch, moduleName, pageInfo, searchParams, userId]
  );
  function startInstance(obj = {}) {
    dispatch({
      type: `${moduleName}/startInstance`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.confirm.instance.job.startTitle'), () => {
        getInstanceList();
      });
    });
  }
  function stopInstance(obj = {}) {
    dispatch({
      type: `${moduleName}/stopInstance`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.confirm.instance.job.stopTitle'), () => {
        getInstanceList();
      });
    });
  }
  function deleteInstance(obj = {}) {
    dispatch({
      type: `${moduleName}/deleteInstance`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.confirm.instance.job.deleteTitle'), () => {
        getInstanceList();
      });
    });
  }
  function getInstanceDetails(obj = {}) {
    dispatch({
      type: `${moduleName}/getInstanceDetails`,
      payload: {
        userId,
        ...obj
      }
    });
  }
  const getEngineList = useCallback(
    (pageInfo = { pageNo: 0, pageSize: 5 }) => {
      dispatch({
        type: `${moduleName}/getEngineList`,
        payload: {
          userId,
          ...pageInfo
        }
      });
    },
    [dispatch, moduleName, userId]
  );
  const getVaGateway = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getVaGateway`,
        payload: {
          userId,
          ...obj
        }
      });
    },
    [dispatch, moduleName, userId]
  );
  const getInstanceStatusList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getInstanceStatusList`,
        payload: {
          userId,
          codeCategory: ['VAP_INSTANCE_STATUS'],
          ...obj
        }
      });
    },
    [dispatch, moduleName, userId]
  );
  const getInstancePriorityList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getInstancePriorityList`,
        payload: {
          userId,
          codeCategory: ['VAP_INSTANCE_PRIORITY'],
          ...obj
        }
      });
    },
    [dispatch, moduleName, userId]
  );
  function createNewInstance(obj = {}) {
    dispatch({
      type: `${moduleName}/createNewInstance`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.dialog.instance.job.createTitle'), () => {
        setEditDialogStatus(false);
        getInstanceList();
      });
    });
  }
  function updateInstance(obj = {}) {
    dispatch({
      type: `${moduleName}/updateInstance`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.dialog.instance.job.updateTitle'), () => {
        setEditDialogStatus(false);
        getInstanceList();
      });
    });
  }

  const getEngineStatusList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getEngineStatusList`,
        payload: {
          userId,
          codeCategory: ['VAP_ENGINE_STATUS'],
          ...obj
        }
      });
    },
    [dispatch, moduleName, userId]
  );

  function handleGetCurrentDetails(item) {
    getInstanceDetails(item);
    setInstanceDetailsStatus(true);
  }

  // handle details list
  useEffect(() => {
    const statusIndex = _.findIndex(statusList, {
      codeValue: _.get(instanceDetails, 'status', '').name
    });
    const statusName = statusIndex >= 0 ? statusList[statusIndex].codeDesc : '';
    // const vaGatewayIndex = _.findIndex(vaGatewayList, { id: _.get(data, 'vaGatewayId', '') });
    // const vaGatewayName = vaGatewayIndex >= 0 ? vaGatewayList[statusIndex].codeDesc : '';
    const detailsList = {
      [I18n.t('vap.dialog.instance.common.status')]: `${statusName} ${
        _.get(instanceDetails, 'status', '').message
      }`,
      [I18n.t('vap.dialog.instance.common.instanceName')]: _.get(instanceDetails, 'name', ''),
      [I18n.t('vap.dialog.instance.common.engineId')]: _.get(instanceDetails, 'appId', ''),
      [I18n.t('vap.dialog.instance.common.priority')]: _.get(instanceDetails, 'priority', ''),
      [I18n.t('vap.dialog.instance.common.processingStartTime')]: _.get(
        instanceDetails,
        'processingStartTime',
        ''
      )
        ? moment(_.get(instanceDetails, 'processingStartTime', '')).format(DATE_FORMAT)
        : '',
      [I18n.t('vap.dialog.instance.common.processingEndTime')]: _.get(
        instanceDetails,
        'processingEndTime',
        ''
      )
        ? moment(_.get(instanceDetails, 'processingEndTime', '')).format(DATE_FORMAT)
        : '',
      [I18n.t('vap.dialog.instance.common.provider')]: _.get(
        instanceDetails,
        'sourceDetails.provider',
        ''
      ),
      [I18n.t('vap.dialog.instance.common.deviceProvider')]: _.get(
        instanceDetails,
        'sourceDetails.deviceProviderId',
        ''
      ),
      [I18n.t('vap.dialog.instance.common.deviceId')]: _.get(
        instanceDetails,
        'sourceDetails.deviceId',
        ''
      ),
      [I18n.t('vap.dialog.instance.common.channelId')]: _.get(
        instanceDetails,
        'sourceDetails.deviceChannelId',
        ''
      ),
      [I18n.t('vap.dialog.instance.common.streamType')]: _.get(
        instanceDetails,
        'sourceDetails.arguments.stream-type',
        ''
      )
    };
    setDetailsList(detailsList);
  }, [instanceDetails, statusList]);

  useEffect(() => {
    if (!_.isEmpty(commonWebsocketData)) {
      // commonWebsocketData.addEventListener('message', e => {
      // const data = JSON.parse(e.data || '{}');
      const type = commonWebsocketData.type ? commonWebsocketData.type.toLocaleLowerCase() : '';
      const message = commonWebsocketData.message
        ? commonWebsocketData.message.toLocaleLowerCase()
        : '';

      if (
        type === 'vap' &&
        message === 'jobinstance'
        // &&
        // _.findIndex(dataSource, { instanceId: commonWebsocketData.data.id }) >= 0
      ) {
        // setDataSource(dataSource =>
        //   handleUpdateListData(dataSource, commonWebsocketData, 'instanceId')
        // );
        dispatchPageInfo({ type: 'pageNo', data: PAGE_NUMBER });
      } else {
        // dispatchPageInfo({ type: 'pageSize', data: PAGE_SIZE });
        // getInstanceList({ pageNo: PAGE_NUMBER, pageSize: PAGE_SIZE });
      }
      // });
    }
  }, [commonWebsocketData]);

  useEffect(() => {
    setDataSource(handleInstanceList(instanceData.items) || []);
    setTotalNum(instanceData.totalNum || 0);
  }, [instanceData]);
  useEffect(() => {
    setCurrentData(instanceDetails || {});
  }, [instanceDetails]);

  useEffect(() => {
    getInstanceList();
  }, [searchParams, pageInfo, getInstanceList]);

  useEffect(() => {
    if (editDialogStatus) getVaGateway();
  }, [editDialogStatus, getVaGateway]);

  useEffect(() => {
    getInstanceStatusList();
    getInstancePriorityList();
    getEngineStatusList();
  }, [getInstanceStatusList, getInstancePriorityList, getEngineStatusList]);

  return (
    <Fragment>
      {confirmDialog && (
        <ConfirmPage
          messageTitle={confirmTitle}
          message={confirmMsg}
          isConfirmPageOpen={confirmDialog}
          hanldeConfirmMessage={confirmActions}
          handleConfirmPageClose={() => setConfirmDialog(false)}
        />
      )}
      {editDialogStatus && (
        <JobVaInstanceEditDialog
          open={editDialogStatus}
          onClose={closeEditDialog}
          editDialogType={editDialogType}
          // instanceData={currentData}
          getEngineList={getEngineList}
          createNewInstance={createNewInstance}
          updateInstance={updateInstance}
        />
      )}
      {instanceDetailsStatus && (
        <VapVAInstanceDetailsDialog
          detailsDialogStatus={instanceDetailsStatus}
          close={() => setInstanceDetailsStatus(false)}
          data={detailsList}
          statusList={statusList}
          // vaGatewayList={vaGatewayList}
        />
      )}
      <TableToolbar
        handleGetDataByPage={params => {
          setSearchParams(_.clone(params));
          dispatchPageInfo({ type: 'pageNo', data: PAGE_NUMBER });
        }}
        fieldList={[
          ['EngineName', 'appName', 'iptType'],
          ['InstanceName', 'instanceName', 'iptType'],
          ['Status', 'status', 'dropdownType'],
          ['Priority', 'priority', 'dropdownType']
        ]}
        dataList={{
          Status: {
            data: statusList,
            type: 'keyVal',
            id: 'codeValue',
            val: 'codeDesc'
          },
          Priority: {
            data: priorityList,
            type: 'keyVal',
            id: 'codeValue',
            val: 'codeDesc'
          }
        }}
      >
        <Tooltip title={I18n.t('vap.toolbar.instance.createInstance')}>
          <IconButton className={classes.add_alarm} onClick={handleOpenCreateDialog}>
            <LibraryAdd />
          </IconButton>
        </Tooltip>
      </TableToolbar>
      <IVHTable
        keyId="instanceId"
        columns={columns}
        dataSource={dataSource}
        extraCell={extraCell}
      />
      <Pagination
        page={pageInfo.pageNo}
        rowsPerPage={pageInfo.pageSize}
        count={_.parseInt(totalNum) || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </Fragment>
  );
}

export default connect(({ global, JobVaInstance }) => ({
  global,
  JobVaInstance
}))(JobVaInstance);
