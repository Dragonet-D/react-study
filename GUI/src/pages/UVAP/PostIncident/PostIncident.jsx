/* eslint-disable no-unused-vars */
import React, { Fragment, useState, useEffect, useReducer, useCallback } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { I18n } from 'react-i18nify';
import {
  PAGE_NUMBER,
  PAGE_SIZE,
  DATE_FORMAT,
  DATE_FORMAT_DATE_T_TIME,
  DATE_FORMAT_DD_MM_YYYY
} from 'commons/constants/const';
import { dataUpdatedHandle } from 'utils/helpers';
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import {
  OperationTableMenu,
  PostIncidentCreateDialog,
  PostIncidentEditDialog,
  JobVaInstanceEditDialog,
  LiveVaInstanceEditDialog,
  ServiceVaInstanceEditDialog,
  VapCollapseBox
} from 'components/UVAP';
import { VAP_COMMON } from 'commons/constants/commonConstant';
import materialKeys from 'utils/materialKeys';
import { VapNoChangeInfoMsg, FILE_MAX_LENGTH } from 'components/UVAP/util';
import {
  Pagination,
  IVHTable,
  ConfirmPage,
  TableToolbar,
  DatePicker,
  Button,
  SingleSelect,
  BasicLayoutTitle,
  IVHTableAntd,
  Permission
} from 'components/common';
import FilterIcon from '@material-ui/icons/FilterList';

import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Reply from '@material-ui/icons/Reply';
import Drawer from '@material-ui/core/Drawer';
import CardMedia from '@material-ui/core/CardMedia';
import { dateFormatForReportList, handleReportTypeList } from 'pages/UVAP/Report/utils';
import {
  handleInstanceList,
  INSTANCE_STATUS_START,
  INSTANCE_STATUS_STOP
} from 'pages/UVAP/VAInstance/util';
import { PlayArrow, Stop, LibraryAdd } from '@material-ui/icons';

import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles(theme => ({
  rightButtom: {
    position: 'absolute',
    right: '0',
    // paddingRight: '12px !important',
    marginRight: '24px'
  },
  itemsStyle: {
    width: '300px'
  },
  filter: {
    marginLeft: '8px'
  },
  btn_wrapper: {
    display: 'flex',
    marginLeft: 'auto'
  },
  itemsRow: {
    margin: '5px 0'
  },
  statusTab: {
    display: 'flex',
    flexDirection: 'column'
  },
  messageTab: {
    fontSize: '85%',
    marginTop: theme.spacing(0.5)
  },
  media_image: {
    height: theme.spacing(5),
    width: theme.spacing(5)
  }
}));

const pageInfoReducer = (pageInfo, action) => {
  switch (action.type) {
    case 'pageNo':
      return { ...pageInfo, pageNo: action.data };
    case 'pageSize':
      return { pageNo: PAGE_NUMBER, pageSize: action.data };
    default:
      throw new Error();
  }
};

const instancePageInfoReducer = (pageInfo, action) => {
  switch (action.type) {
    case 'pIndex':
      return { ...pageInfo, pIndex: action.data };
    case 'pSize':
      return { pIndex: PAGE_NUMBER, pSize: action.data };
    default:
      throw new Error();
  }
};

const searchParamsActions = (params, action) => {
  switch (action.type) {
    case 'reset':
      return {
        startTime: moment(_.toNumber(new Date().getTime() - 1000 * 60 * 60 * 24)).format(
          DATE_FORMAT_DATE_T_TIME
        ),
        endTime: moment(_.toNumber(new Date().getTime())).format(DATE_FORMAT_DATE_T_TIME)
      };
    case 'changeParams':
      return {
        ...params,
        ...action.data
      };
    case 'param':
      return { ...params, param: action.data };
    case 'endTime':
      return { ...params, endTime: action.data };
    case 'startTime':
      return { ...params, startTime: action.data };
    default:
      throw new Error();
  }
};

function PostIncident(props) {
  const classes = useStyles();
  const { dispatch, global, PostIncident } = props;
  const { userId, commonWebsocketData } = global;
  const moduleName = PostIncident.namespace;
  const { incidentList, incidentInstances, reportTypeList, reportList, instanceStatusList } =
    PostIncident || {};
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, dispatchPageInfo] = useReducer(pageInfoReducer, {
    pageNo: PAGE_NUMBER,
    pageSize: PAGE_SIZE
  });
  const [totalNum, setTotalNum] = useState(0);
  const [currentData, setCurrentData] = useState({});
  const [oldData, setOldData] = useState({});
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMsg, setConfirmMsg] = useState('');
  const [confirmType, setConfirmType] = useState('');
  const [filterStatus, setFilterStatus] = useState(true);

  const [simpleReportTypeList, setSimpleReportTypeList] = useState([]);
  // search params
  // const [searchParams, dispatchSearchParams] = useReducer(searchParamsActions, {
  //   startTime: moment(_.toNumber(new Date().getTime() - 1000 * 60 * 60 * 24)).format(
  //     DATE_FORMAT_DATE_T_TIME
  //   ),
  //   endTime: moment(_.toNumber(new Date().getTime())).format(DATE_FORMAT_DATE_T_TIME)
  // });
  const [searchParams, setSearchParams] = useState('{}');

  // create dialog init
  const [createDialogStatus, setCreateDialogStatus] = useState(false);

  // edit dialog init
  const [editDialogStatus, setEditDialogStatus] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  // instance page info
  const [instancePageInfo, dispatchInstancePage] = useReducer(instancePageInfoReducer, {
    pIndex: PAGE_NUMBER,
    pSize: PAGE_SIZE
  });
  const [instanceTotalNum, setInstanceTotalNum] = useState(0);
  // confirm page action setting
  function confirmActions() {
    switch (confirmType) {
      case 'delete':
        setConfirmDialog(false);
        handleDeleteIncident({ ids: [currentData.incidentUuid] });
        break;
      case 'deleteInstance':
        setConfirmDialog(false);
        deleteInstance('JobVaInstance', { id: currentInstanceDetails.instanceId });
        break;
      case 'startInstance':
        setConfirmDialog(false);
        startInstance('JobVaInstance', { id: currentInstanceDetails.instanceId });
        break;
      case 'stopInstance':
        setConfirmDialog(false);
        stopInstance('JobVaInstance', { id: currentInstanceDetails.instanceId });
        break;
      case 'close':
        setConfirmDialog(false);
        handleCloseIncident([currentData.incidentUuid]);
        break;
      default:
        break;
    }
  }

  // init data
  const getIncidentList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getIncidentList`,
        payload: {
          userId,
          pageNo: pageInfo.pageNo,
          pageSize: pageInfo.pageSize,
          ...obj,
          param: searchParams ? JSON.parse(searchParams) : {}
        }
      });
    },
    [dispatch, moduleName, pageInfo.pageNo, pageInfo.pageSize, searchParams, userId]
  );

  // page func
  function onChangePage(e, page) {
    dispatchPageInfo({ type: 'pindex', data: page });
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    dispatchPageInfo({ type: 'psize', data: value });
  }

  function onChangeInstancePage(e, page) {
    dispatchInstancePage({ type: 'pIndex', data: page });
    getIncidentInstances({ incidentId: currentData.incidentUuid, pIndex: page });
  }
  function onChangeRowsPerInstancePage(e) {
    const { value } = e.target;
    dispatchInstancePage({ type: 'pSize', data: value });
    getIncidentInstances({ incidentId: currentData.incidentUuid, pSize: value });
  }

  // table columns setting
  const columns = [
    {
      title: I18n.t('vap.table.incident.name'),
      dataIndex: 'incidentName'
    },
    {
      title: I18n.t('vap.table.incident.type'),
      dataIndex: 'incidentType'
    },
    {
      title: I18n.t('vap.table.incident.description'),
      dataIndex: 'incidentDescription'
    },
    {
      title: I18n.t('vap.table.incident.created'),
      dataIndex: 'createdDate',
      // render: text => <span>{moment(_.toNumber(new Date(text).getTime()).format(DATE_FORMAT))}</span>
      render: text => <span>{moment(new Date(text).getTime()).format(DATE_FORMAT)}</span>
    },
    {
      title: I18n.t('vap.table.incident.createdBy'),
      dataIndex: 'createdId'
    },
    {
      title: I18n.t('vap.table.incident.status'),
      dataIndex: 'status'
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
        title: I18n.t('vap.table.incident.operationMenu.update'),
        action: 'update'
      },
      {
        icon: 'ViewList',
        title: I18n.t('vap.table.incident.operationMenu.instance'),
        action: 'showInstance'
      },
      {
        icon: 'NoSim',
        title: I18n.t('vap.table.incident.operationMenu.close'),
        dataIndex: 'status',
        action: 'close'
      },
      {
        icon: 'Delete',
        title: I18n.t('vap.table.incident.operationMenu.delete'),
        action: 'delete'
      }
    ]
  };

  function handleActions(target, data) {
    switch (target) {
      case 'update':
        setCurrentData(data);
        setEditDialogStatus(true);
        break;
      case 'showInstance':
        setCurrentData(data);
        setOldData(_.cloneDeep(data));
        setActiveIndex(1);
        getIncidentInstances({ incidentId: data.incidentUuid });
        break;
      case 'close':
        setCurrentData(data);
        setConfirmTitle(I18n.t('vap.confirm.incident.closeTitle'));
        setConfirmMsg(I18n.t('vap.confirm.incident.closeMsg'));
        setConfirmType(target);
        setConfirmDialog(true);
        break;
      case 'delete':
        setCurrentData(data);
        setConfirmTitle(I18n.t('vap.confirm.incident.deleteTitle'));
        setConfirmMsg(I18n.t('vap.confirm.incident.deleteMsg'));
        setConfirmType(target);
        setConfirmDialog(true);
        break;
      default:
        break;
    }
  }

  const ExtraCell = item => {
    const { incidentUuid, status } = item;
    return (
      <OperationTableMenu
        columns={opertayionMenu}
        key={incidentUuid}
        itemId={incidentUuid}
        currentData={item}
        getActionData={handleActions}
        disabled={status === 'close'}
      />
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

  // toolbar button runder
  // const CreateButtonRender = () => (
  //   <Tooltip title={I18n.t('vap.toolbar.incident.createBtnMsg')} className={classes.rightButtom}>
  //     <IconButton
  //       aria-label={I18n.t('vap.toolbar.incident.createBtnMsg')}
  //       onClick={() => setCreateDialogStatus(true)}
  //     >
  //       <LibraryAdd style={{ color: 'ffa517' }} />
  //     </IconButton>
  //   </Tooltip>
  // );

  function handleSaveNewIncident(obj = {}) {
    dispatch({
      type: `${moduleName}/createNewIncident`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.dialog.incident.createTitle'), () => {
        // dispatchSearchParams({
        //   type: 'changeParams',
        //   data: {
        //     startTime: moment(_.toNumber(new Date().getTime() - 1000 * 60 * 60 * 24)).format(
        //       DATE_FORMAT_DATE_T_TIME
        //     ),
        //     endTime: moment(_.toNumber(new Date().getTime() + 1000 * 60)).format(
        //       DATE_FORMAT_DATE_T_TIME
        //     )
        //   }
        // });
        getIncidentList();
        //   {
        //   startTime: moment(_.toNumber(new Date().getTime() - 1000 * 60 * 60 * 24)).format(
        //     DATE_FORMAT_DATE_T_TIME
        //   ),
        //   endTime: moment(_.toNumber(new Date().getTime() + 1000 * 60)).format(
        //     DATE_FORMAT_DATE_T_TIME
        //   )
        // }
        setCreateDialogStatus(false);
      });
    });
  }

  function handleDeleteIncident(obj = {}) {
    dispatch({
      type: `${moduleName}/deleteIncident`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.confirm.incident.deleteTitle'), () => {
        getIncidentList();
      });
    });
  }

  function handleCloseIncident(array = []) {
    dispatch({
      type: `${moduleName}/closeIncident`,
      payload: array
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.confirm.incident.closeTitle'), () => {
        getIncidentList();
      });
    });
  }

  const getIncidentInstances = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getIncidentInstances`,
        payload: {
          userId,
          ...instancePageInfo,
          ...obj
        }
      });
    },
    [dispatch, instancePageInfo, moduleName, userId]
  );

  const validationAction = (data, action) => {
    switch (action.type) {
      case 'reset':
        return { incidentName: false, incidentType: false, incidentFile: false };
      case 'incidentName':
        return { ...data, incidentName: action.data };
      case 'incidentType':
        return { ...data, incidentType: action.data };
      case 'incidentFile':
        return { ...data, incidentFile: action.data };
      default:
        return { ...data };
    }
  };

  const [validation, dispatchValidation] = useReducer(validationAction, {
    incidentName: false,
    incidentType: false,
    incidentFile: false
  });

  const [instanceList, setInstanceList] = useState([]);
  const [oldDetails, setOldDetails] = useState({});
  const currentDetailsActions = (data, action) => {
    if (
      action.type !== '' &&
      action.type !== 'resert' &&
      !_.isNil(action.data) &&
      action.data !== ''
    ) {
      dispatchValidation({ type: action.type, data: false });
    }
    switch (action.type) {
      case '':
        return { ...action.data };
      case 'resert':
        return { ...oldDetails };
      case 'incidentName':
        return { ...data, incidentName: action.data };
      case 'incidentType':
        return { ...data, incidentType: action.data };
      case 'incidentFile':
        return { ...data, incidentFile: action.data };
      case 'file':
        return { ...data, file: action.data };
      case 'incidentDescription':
        return { ...data, incidentDescription: action.data };
      default:
        throw new Error();
    }
  };
  const [currentDetails, dispatchCurrentDetails] = useReducer(currentDetailsActions, {});
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');

  // table columns Instance setting
  const [currentInstanceDetails, setCurrentInstanceDetails] = useState({});
  const [editDialogType, setEditDialogType] = useState('create');
  function instanceHandleActions(target, data) {
    switch (target) {
      case 'update':
        setCurrentInstanceType('JobVaInstance');
        setEditDialogType('update');
        getInstanceDetails('JobVaInstance', data);
        setCurrentInstanceDetails(data);
        setJobDialogStatus(true);
        break;
      case 'start':
        setConfirmType('startInstance');
        setCurrentInstanceDetails(data);
        setConfirmTitle(I18n.t('vap.confirm.instance.job.startTitle'));
        setConfirmMsg(I18n.t('vap.confirm.instance.job.startMsg'));
        setConfirmDialog(true);
        break;
      case 'stop':
        setConfirmType('stopInstance');
        setCurrentInstanceDetails(data);
        setConfirmTitle(I18n.t('vap.confirm.instance.job.stopTitle'));
        setConfirmMsg(I18n.t('vap.confirm.instance.job.stopMsg'));
        setConfirmDialog(true);
        break;
      case 'delete':
        setConfirmType('deleteInstance');
        setCurrentInstanceDetails(data);
        setConfirmTitle(I18n.t('vap.confirm.instance.job.deleteTitle'));
        setConfirmMsg(I18n.t('vap.confirm.instance.job.deleteMsg'));
        setConfirmDialog(true);
        break;
      default:
        break;
    }
  }
  // table operation menu setting
  const instanceOpertayionMenu = {
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
  const InstanceExtraCell = item => {
    const { id, status } = item;
    const btnStatus = _.indexOf(INSTANCE_STATUS_START, status.name) >= 0;
    return (
      <Fragment>
        <IconButton onClick={() => instanceHandleActions(btnStatus ? 'start' : 'stop', item)}>
          {btnStatus ? <PlayArrow /> : <Stop />}
        </IconButton>
        <OperationTableMenu
          columns={instanceOpertayionMenu}
          key={id}
          itemId={id}
          currentData={item}
          getActionData={instanceHandleActions}
        />
      </Fragment>
    );
  };

  const columnsInstance = [
    {
      title: I18n.t('vap.table.engines.status'),
      dataIndex: 'status',
      tooltipTitle: 'status.message',
      render: status => (
        <div className={classes.statusTab}>
          <span>
            {_.findIndex(instanceStatusList, { codeValue: status.name }) >= 0
              ? instanceStatusList[_.findIndex(instanceStatusList, { codeValue: status.name })]
                .codeDesc
              : ''}
          </span>
          {status.message ? <span className={classes.messageTab}>{status.message}</span> : ''}
        </div>
      )
    },
    {
      title: I18n.t('vap.table.instance.name'),
      dataIndex: 'name'
    },
    {
      title: I18n.t('vap.table.instance.appName'),
      dataIndex: 'appName'
    },
    {
      title: I18n.t('vap.table.instance.priority'),
      dataIndex: 'priority'
    },
    {
      title: I18n.t('vap.table.instance.created'),
      dataIndex: 'created',
      render: text => <span>{moment(_.toNumber(text)).format(DATE_FORMAT)}</span>
    },
    {
      title: I18n.t('vap.table.instance.created'),
      dataIndex: '',
      render: item => InstanceExtraCell(item)
    }
  ];

  function getInstanceDetails(type, obj = {}) {
    dispatch({
      type: `${type}/getInstanceDetails`,
      payload: {
        userId,
        ...obj
      }
    });
  }

  function handleChangeFile(obj) {
    if (obj !== '') {
      if (obj.file.size / 1024 / 1000 > FILE_MAX_LENGTH) {
        dispatchValidation({ type: 'incidentFile', data: true });
        setUploadErrorMsg(`${I18n.t('vap.dialog.files.uploadMaxError')}${FILE_MAX_LENGTH}MB`);
      } else {
        setUploadErrorMsg('');
        dispatchValidation({ type: 'incidentFile', data: false });
        dispatchCurrentDetails({ type: 'incidentFile', data: obj.file.name });
        dispatchCurrentDetails({ type: 'file', data: obj.file });
      }
    } else {
      setUploadErrorMsg('');
      dispatchValidation({ type: 'incidentFile', data: false });
      dispatchCurrentDetails({ type: 'incidentFile', data: '' });
      dispatchCurrentDetails({ type: 'file', data: null });
    }
  }

  function handleUpdate() {
    let validateIsOk = true;
    if (_.isNil(currentDetails.incidentName) || currentDetails.incidentName === '') {
      dispatchValidation({ type: 'incidentName', data: true });
      validateIsOk = false;
    }
    if (_.isNil(currentDetails.incidentFile) || currentDetails.incidentFile === '') {
      dispatchValidation({ type: 'incidentFile', data: true });
      validateIsOk = false;
    }
    if (_.isNil(currentDetails.incidentType) || currentDetails.incidentType === '') {
      dispatchValidation({ type: 'incidentType', data: true });
      validateIsOk = false;
    }

    if (_.isEqual(currentDetails, oldDetails)) {
      VapNoChangeInfoMsg(I18n.t('vap.toolbar.incident.updateTitle'));
      return false;
    }

    if (validateIsOk) {
      const newData = currentDetails;
      newData.instances = instanceList;
      handleUpdateIncident(newData);
    } else {
      return false;
    }
  }

  function handleUpdateIncident(obj = {}) {
    dispatch({
      type: `${moduleName}/updateIncident`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.toolbar.incident.updateTitle'), () => {
        // getIncidentInstances({ id: currentData.incidentUuid });
        setEditDialogStatus(false);
      });
    });
  }

  const [jobDialogStatus, setJobDialogStatus] = useState(false);
  const [liveDialogStatus, setLiveDialogStatus] = useState(false);
  const [serviceDialogStatus, setServiceDialogStatus] = useState(false);
  const [currentInstanceType, setCurrentInstanceType] = useState('');

  const getEngineList = useCallback(
    (pageInfo = { pindex: 0, psize: 5 }) => {
      if (currentInstanceType !== '') {
        dispatch({
          type: `${currentInstanceType}/getEngineList`,
          payload: {
            userId,
            ...pageInfo
          }
        });
      } else {
        return false;
      }
    },
    [currentInstanceType, dispatch, userId]
  );

  const getVaGateway = useCallback(
    (obj = {}) => {
      if (currentInstanceType !== '') {
        dispatch({
          type: `${currentInstanceType}/getVaGateway`,
          payload: {
            userId,
            ...obj
          }
        });
      } else {
        return false;
      }
    },
    [currentInstanceType, dispatch, userId]
  );

  function createNewJobInstance(obj = {}) {
    dispatch({
      type: `${moduleName}/createNewJobInstance`,
      payload: {
        userId,
        incidentUuid: currentData.incidentUuid,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.dialog.instance.job.createTitle'), () => {
        setJobDialogStatus(false);
        setCurrentInstanceType('');
        getIncidentInstances({ incidentId: currentData.incidentUuid });
      });
    });
  }

  function createNewLiveInstance(obj = {}) {
    dispatch({
      type: `${moduleName}/createNewLiveInstance`,
      payload: {
        userId,
        incidentUuid: currentData.incidentUuid,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.dialog.instance.live.createTitle'), () => {
        setLiveDialogStatus(false);
        setCurrentInstanceType('');
        getIncidentInstances({ incidentId: currentData.incidentUuid });
      });
    });
  }
  function createNewServiceInstance(obj = {}) {
    dispatch({
      type: `${moduleName}/createNewServiceInstance`,
      payload: {
        userId,
        incidentUuid: currentData.incidentUuid,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.dialog.instance.live.createTitle'), () => {
        setServiceDialogStatus(false);
        setCurrentInstanceType('');
        getIncidentInstances({ incidentId: currentData.incidentUuid });
      });
    });
  }

  // toolbar button render
  // const CreateInstanceButtonRender = () => (
  //   <div className={classes.rightButtom}>
  //     <Tooltip title={I18n.t('vap.toolbar.incident.createJob')}>
  //       <IconButton
  //         aria-label={I18n.t('vap.toolbar.incident.createJob')}
  //         onClick={() => {
  //           setJobDialogStatus(true);
  //           setCurrentInstanceType('JobVaInstance');
  //         }}
  //       >
  //         <LibraryAdd style={{ color: 'ffa517' }} />
  //       </IconButton>
  //     </Tooltip>
  //     <Tooltip title={I18n.t('vap.toolbar.incident.back')}>
  //       <IconButton
  //         aria-label={I18n.t('vap.toolbar.incident.back')}
  //         onClick={() => {
  //           setActiveIndex(0);
  //         }}
  //       >
  //         <Reply style={{ color: 'ffa517' }} />
  //       </IconButton>
  //     </Tooltip>
  //     {/* <Tooltip title={I18n.t('vap.toolbar.incident.createLive')}>
  //       <IconButton
  //         aria-label={I18n.t('vap.toolbar.incident.createLive')}
  //         onClick={() => {
  //           setLiveDialogStatus(true);
  //           setCurrentInstanceType('LiveVaInstance');
  //         }}
  //       >
  //         <LibraryAdd style={{ color: 'ffa517' }} />
  //       </IconButton>
  //     </Tooltip>
  //     <Tooltip title={I18n.t('vap.toolbar.incident.createService')}>
  //       <IconButton
  //         aria-label={I18n.t('vap.toolbar.incident.createService')}
  //         onClick={() => {
  //           setServiceDialogStatus(true);
  //           setCurrentInstanceType('ServiceVaInstance');
  //         }}
  //       >
  //         <LibraryAdd style={{ color: 'ffa517' }} />
  //       </IconButton>
  //     </Tooltip> */}
  //   </div>
  // );

  // post incident details
  const currentDate = new Date();
  const [reportTableStatus, setReportTableStatus] = useState(false);
  const [currentReportType, setCurrentReportType] = useState('');
  const [instanceType, setInstanceType] = useState('JOB_VA');
  const [timefr, setTimefr] = useState(currentDate.setHours(0, 0, 0, 0));
  const [timeto, setTimeto] = useState(currentDate.setHours(23, 59, 59, 999));
  const [sort, setSort] = useState('');
  const [reportTableList, setReportTableList] = useState([]);
  const [pindex, setPindex] = useState(PAGE_NUMBER);
  const [psize, setPsize] = useState(PAGE_SIZE);

  const [previewStatus, setPreviewStatus] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  function resetFilterParams() {
    setCurrentReportType('');
    setInstanceType('');
    setTimefr(currentDate.setHours(0, 0, 0, 0));
    setTimeto(currentDate.setHours(23, 59, 59, 999));
    setSort('');
  }

  function onChangeReportPage(e, page) {
    setPindex(page);
    getReportListsFunc({ pindex: page });
  }
  function onChangeRowsReportPerPage(e) {
    const { value } = e.target;
    setPindex(PAGE_NUMBER);
    setPsize(value);
    getReportListsFunc({ pindex: PAGE_NUMBER, psize: value });
  }

  const getReportTypeList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getReportTypeList`,
        payload: {
          userId,
          ...obj
        }
      });
    },
    [dispatch, moduleName, userId]
  );

  const columnsReport = [
    {
      title: I18n.t('vap.table.report.time'),
      dataIndex: 'time',
      render: text => <span>{moment(_.toNumber(text)).format(DATE_FORMAT)}</span>
    },
    {
      title: I18n.t('vap.table.report.provider'),
      dataIndex: 'source.provider'
    },
    {
      title: I18n.t('vap.table.report.data'),
      dataIndex: 'data',
      render: text => <span>{JSON.stringify(text)}</span>
    },
    {
      title: I18n.t('vap.table.report.type'),
      dataIndex: 'data.snapshotType'
    }
  ];

  const handlePreview = image => () => {
    setPreviewStatus(true);
    setPreviewImage(image);
  };

  function previewClose() {
    setPreviewStatus(false);
  }

  const ImgCell = item => {
    return (
      item._snapshotId && (
        <CardMedia
          onClick={handlePreview(item._image)}
          className={classes.media_image}
          image={item._image}
        />
      )
    );
  };

  const imgExtraCell = {
    columns: [
      {
        title: I18n.t('vap.table.report.snapshot'),
        dataIndex: '_image',
        key: '11'
      }
    ],
    components: [
      {
        component: ImgCell,
        key: '11'
      }
    ]
  };

  // report table
  const [rowSelectItems, setRowSelectItems] = useState([]);
  const [selectInstance, setSelectInstance] = useState([]);
  function handleRowItemSelect(ids, items) {
    setRowSelectItems(ids);
    setSelectInstance(
      items.map(item => ({ id: item.instanceId, appId: item.appId, type: 'JOB_VA' }))
    );
  }

  const getReportList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getReportList`,
        payload: {
          // userId,
          ...obj
        }
      });
    },
    [dispatch, moduleName]
  );

  const getReportListsFunc = useCallback(
    params => {
      const obj = {
        data: [],
        page: {
          index: params.pindex ? params.pindex : pindex,
          size: params.psize ? params.psize : psize,
          sort
        },
        sources: [],
        time: {
          from: timefr,
          to: timeto
        },
        type: currentReportType,
        vaInstances: selectInstance
      };
      getReportList(obj);
    },
    [pindex, psize, sort, timefr, timeto, currentReportType, selectInstance, getReportList]
  );

  function handleFilterReports() {
    setReportTableStatus(true);
    getReportListsFunc({});
  }

  const rowSelectionConfig = {
    selectedRowKeys: rowSelectItems,
    onChange: handleRowItemSelect
  };

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
        type: `${currentInstanceType}/getInstancePriorityList`,
        payload: {
          userId,
          codeCategory: ['VAP_INSTANCE_PRIORITY'],
          ...obj
        }
      });
    },
    [currentInstanceType, dispatch, userId]
  );
  const getEngineStatusList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${currentInstanceType}/getEngineStatusList`,
        payload: {
          userId,
          codeCategory: ['VAP_ENGINE_STATUS'],
          ...obj
        }
      });
    },
    [currentInstanceType, dispatch, userId]
  );

  function updateInstance(obj = {}) {
    dispatch({
      type: `${currentInstanceType}/updateInstance`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.dialog.instance.job.updateTitle'), () => {
        setJobDialogStatus(false);
        getIncidentInstances({ incidentId: currentData.incidentUuid });
      });
    });
  }

  function deleteInstance(type, obj = {}) {
    dispatch({
      type: `${type}/deleteInstance`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.confirm.instance.job.deleteTitle'), () => {
        getIncidentInstances({ incidentId: currentData.incidentUuid });
      });
    });
  }

  function startInstance(type, obj = {}) {
    dispatch({
      type: `${type}/startInstance`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.confirm.instance.job.startTitle'), () => {
        getIncidentInstances({ incidentId: currentData.incidentUuid });
      });
    });
  }

  function stopInstance(type, obj = {}) {
    dispatch({
      type: `${type}/stopInstance`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.confirm.instance.job.stopTitle'), () => {
        getIncidentInstances({ incidentId: currentData.incidentUuid });
      });
    });
  }

  useEffect(() => {
    if (!_.isEmpty(JSON.parse(searchParams))) getIncidentList();
  }, [getIncidentList, searchParams]);

  useEffect(() => {
    if (incidentInstances.items) {
      const instances = incidentInstances.items.map(item => ({
        ...item,
        status: item.status ? JSON.parse(item.status) : {},
        sourceDetails: item.sourceDetails ? JSON.parse(item.sourceDetails) : {}
      }));
      setInstanceList(instances || []);
    }

    setInstanceTotalNum(_.parseInt(incidentInstances.totalNum) || 0);
    const newIncident = _.cloneDeep(incidentInstances);
    delete newIncident.instances;
    dispatchCurrentDetails({ type: '', data: _.cloneDeep(newIncident) } || {});
    setOldDetails(_.cloneDeep(incidentInstances) || {});
  }, [incidentInstances]);

  useEffect(() => {
    if (jobDialogStatus || liveDialogStatus || serviceDialogStatus) getVaGateway();
  }, [jobDialogStatus, liveDialogStatus, serviceDialogStatus, getVaGateway]);

  useEffect(() => {
    if (activeIndex === 1) {
      getInstanceStatusList();
      getInstancePriorityList();
      getEngineStatusList();
      getReportTypeList();
    }
  }, [
    activeIndex,
    getEngineStatusList,
    getInstancePriorityList,
    getInstanceStatusList,
    getReportTypeList
  ]);

  useEffect(() => {
    setDataSource(incidentList.content || []);
    setTotalNum(incidentList.totalElements || 0);
  }, [incidentList]);

  useEffect(() => {
    setReportTableList(
      _.isEmpty(reportList.items) || _.isNil(reportList.items)
        ? []
        : dateFormatForReportList(reportList.items)
    );
  }, [reportList]);

  useEffect(() => {
    setSimpleReportTypeList(handleReportTypeList(reportTypeList));
  }, [reportTypeList]);

  // websocket update instance
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
        getIncidentInstances({ incidentId: currentData.incidentUuid, pIndex: PAGE_NUMBER });
      }
      // else {
      //   getIncidentInstances({ incidentId: currentData.incidentUuid, pIndex: PAGE_NUMBER });
      //   // dispatchPageInfo({ type: 'psize', data: PAGE_SIZE });
      //   // getInstanceList({ pindex: PAGE_NUMBER, psize: PAGE_SIZE });
      // }
      // });
    }
  }, [commonWebsocketData, currentData.incidentUuid, getIncidentInstances]);

  return (
    <Fragment>
      {jobDialogStatus && (
        <JobVaInstanceEditDialog
          open={jobDialogStatus}
          onClose={() => setJobDialogStatus(false)}
          editDialogType={editDialogType}
          // instanceData={currentData}
          getEngineList={getEngineList}
          createNewInstance={createNewJobInstance}
          updateInstance={updateInstance}
        />
      )}
      {liveDialogStatus && (
        <LiveVaInstanceEditDialog
          open={liveDialogStatus}
          onClose={() => setLiveDialogStatus(false)}
          editDialogType={editDialogType}
          instanceData={currentData}
          getEngineList={getEngineList}
          createNewInstance={createNewLiveInstance}
          // updateInstance={updateInstance}
        />
      )}
      {serviceDialogStatus && (
        <ServiceVaInstanceEditDialog
          open={serviceDialogStatus}
          onClose={() => setServiceDialogStatus(false)}
          editDialogType={editDialogType}
          instanceData={currentData}
          getEngineList={getEngineList}
          createNewInstance={createNewServiceInstance}
          // updateInstance={updateInstance}
        />
      )}
      {confirmDialog && (
        <ConfirmPage
          messageTitle={confirmTitle}
          message={confirmMsg}
          isConfirmPageOpen={confirmDialog}
          hanldeConfirmMessage={confirmActions}
          handleConfirmPageClose={() => setConfirmDialog(false)}
        />
      )}

      {createDialogStatus && (
        <PostIncidentCreateDialog
          open={createDialogStatus}
          onClose={() => setCreateDialogStatus(false)}
          onSave={handleSaveNewIncident}
          userId={userId}
        />
      )}

      {editDialogStatus && (
        <PostIncidentEditDialog
          open={editDialogStatus}
          onClose={() => setEditDialogStatus(false)}
          onSave={handleUpdateIncident}
          userId={userId}
          incidentDetails={currentData}
        />
      )}
      <SwipeableViews
        // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeIndex}
      >
        <Typography
          component="div"
          role="tabpanel"
          hidden={activeIndex !== 0}
          id={`full-width-tabpanel-${activeIndex}`}
          aria-labelledby={`full-width-tab-${activeIndex}`}
        >
          <BasicLayoutTitle titleName={I18n.t('menu.uvap.children.postIncident.name')}>
            <IconButton
              size="small"
              className={classes.filter}
              onClick={() => setFilterStatus(filterStatus => !filterStatus)}
            >
              <FilterIcon color="primary" />
            </IconButton>

            <Tooltip
              title={I18n.t('vap.toolbar.incident.createBtnMsg')}
              className={classes.rightButtom}
            >
              <IconButton size="small" onClick={() => setCreateDialogStatus(true)}>
                <LibraryAdd />
              </IconButton>
            </Tooltip>
          </BasicLayoutTitle>
          <VapCollapseBox filterStatus={filterStatus}>
            <Grid container alignItems="center" className={classes.itemsRow}>
              <Grid item>
                {/* <TextField
                  label={I18n.t('vap.toolbar.incident.params')}
                  placeholder={I18n.t('vap.toolbar.incident.paramsPlaceholder')}
                  value={searchParams.param || ''}
                  onChange={e => dispatchSearchParams({ type: 'param', data: e.target.value })}
                  fullWidth
                /> */}
                <Permission materialKey={materialKeys['M4-160']}>
                  <TableToolbar
                    handleGetDataByPage={params => {
                      // dispatchSearchParams({ type: 'param', data: _.clone(params) });
                      setSearchParams(JSON.stringify(params));
                    }}
                    fieldList={[
                      ['IncidentName', 'incidentName', 'iptType'],
                      ['InstanceType', 'instanceType', 'dropdownType'],
                      ['Status', 'status', 'dropdownType'],
                      ['Range', 'range', 'rangeType']
                    ]}
                    dataList={{
                      Status: {
                        data: ['open', 'close'],
                        type: 'normal'
                      },
                      InstanceType: {
                        data: VAP_COMMON.incidentType,
                        type: 'normal'
                      }
                    }}
                  />
                </Permission>
              </Grid>
              {/* <Grid item className={classes.itemsStyle}>
                <DatePicker
                  value={searchParams.startTime}
                  handleChange={val =>
                    dispatchSearchParams({
                      type: 'startTime',
                      data: moment(val).format(DATE_FORMAT_DATE_T_TIME)
                    })
                  }
                  label={I18n.t('vap.toolbar.incident.from')}
                  maxDate={searchParams.endTime || new Date()}
                  fullWidth
                />
              </Grid>
              <Grid item className={classes.itemsStyle}>
                <DatePicker
                  value={searchParams.endTime}
                  handleChange={val =>
                    dispatchSearchParams({
                      type: 'endTime',
                      data: moment(val).format(DATE_FORMAT_DATE_T_TIME)
                    })
                  }
                  label={I18n.t('vap.toolbar.incident.to')}
                  minDate={searchParams.startTime || new Date()}
                  fullWidth
                />
              </Grid>
              <Grid item className={classes.itemsStyle}>
                <Button onClick={getIncidentList}>{I18n.t('global.button.filter')}</Button>
                <Button onClick={() => dispatchSearchParams({ type: 'reset' })}>
                  {I18n.t('global.button.reset')}
                </Button>
              </Grid> */}
            </Grid>
          </VapCollapseBox>
          <IVHTable
            keyId="incidentUuid"
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
        </Typography>
        <Typography
          component="div"
          role="tabpanel"
          hidden={activeIndex !== 1}
          id={`full-width-tabpanel-${activeIndex}`}
          aria-labelledby={`full-width-tab-${activeIndex}`}
        >
          <BasicLayoutTitle titleName={I18n.t('vap.toolbar.incident.postIncidentDetails')}>
            <div className={classes.btn_wrapper}>
              <Tooltip title={I18n.t('vap.toolbar.incident.createJob')}>
                <IconButton
                  size="small"
                  onClick={() => {
                    setJobDialogStatus(true);
                    setCurrentInstanceType('JobVaInstance');
                  }}
                >
                  <LibraryAdd />
                </IconButton>
              </Tooltip>
              <Tooltip title={I18n.t('vap.toolbar.incident.back')}>
                <IconButton
                  size="small"
                  onClick={() => {
                    setActiveIndex(0);
                  }}
                >
                  <Reply />
                </IconButton>
              </Tooltip>
            </div>
          </BasicLayoutTitle>

          <Grid container spacing={2} alignItems="center" className={classes.itemsRow}>
            <Grid item className={classes.itemsStyle}>
              <SingleSelect
                label={I18n.t('vap.toolbar.report.reportType')}
                selectOptions={simpleReportTypeList}
                onSelect={setCurrentReportType}
                value={currentReportType || ''}
                fullWidth
                required
                keyValue
                dataIndex={{ name: 'name', value: 'reportType', key: '_key' }}
              />
            </Grid>

            {/* <Grid item className={classes.itemsStyle}>
              <SingleSelect
                label={I18n.t('vap.toolbar.report.instanceType')}
                selectOptions={VAP_COMMON.vaInstanceType}
                onSelect={setInstanceType}
                value={instanceType || ''}
                fullWidth
                required
              />
            </Grid> */}

            <Grid item className={classes.itemsStyle}>
              <DatePicker
                value={timefr}
                handleChange={val => {
                  const newDate = new Date(val);
                  setTimefr(newDate.setHours(0, 0, 0, 0));
                }}
                label="From"
                maxDate={timeto || currentDate.setHours(23, 59, 59, 999)}
                type="date"
                format={DATE_FORMAT_DD_MM_YYYY}
                fullWidth
              />
            </Grid>
            <Grid item className={classes.itemsStyle}>
              <DatePicker
                value={timeto}
                handleChange={val => {
                  const newDate = new Date(val);
                  setTimeto(newDate.setHours(23, 59, 59, 999));
                }}
                label="To"
                minDate={timefr || currentDate.setHours(0, 0, 0, 0)}
                type="date"
                format={DATE_FORMAT_DD_MM_YYYY}
                fullWidth
              />
            </Grid>
            <Grid item className={classes.itemsStyle}>
              <SingleSelect
                label={I18n.t('vap.toolbar.report.sort')}
                selectOptions={VAP_COMMON.sort}
                onSelect={setSort}
                value={sort || ''}
                fullWidth
                required
              />
            </Grid>
            <Grid item className={classes.itemsStyle}>
              <Button onClick={handleFilterReports} disabled={false}>
                {I18n.t('global.button.filter')}
              </Button>
              <Button onClick={resetFilterParams}>{I18n.t('global.button.reset')}</Button>
            </Grid>
          </Grid>
          <IVHTableAntd
            columns={columnsInstance}
            dataSource={instanceList}
            rowSelection={rowSelectionConfig}
            rowKey="id"
          />

          <Pagination
            page={instancePageInfo.pIndex}
            rowsPerPage={instancePageInfo.pSize}
            count={instanceTotalNum}
            onChangePage={onChangeInstancePage}
            onChangeRowsPerPage={onChangeRowsPerInstancePage}
          />
          <Drawer
            open={reportTableStatus}
            onClose={() => setReportTableStatus(false)}
            variant="temporary"
            anchor="bottom"
          >
            {/* <IVHTable
              columns={columnsReport}
              dataSource={reportTableList}
              extraCell={imgExtraCell}
            /> */}
            {/* <IVHTableAntd columns={columnsReport} dataSource={reportTableList} /> */}
            <IVHTable
              extraCellPrev={imgExtraCell}
              keyId="_id"
              columns={columnsReport}
              dataSource={reportTableList}
            />
            <Pagination
              page={pindex || PAGE_NUMBER}
              rowsPerPage={psize || PAGE_SIZE}
              count={_.parseInt(reportList.totalNum) || 0}
              onChangePage={onChangeReportPage}
              onChangeRowsPerPage={onChangeRowsReportPerPage}
            />
          </Drawer>
        </Typography>
      </SwipeableViews>

      {/* img dialog */}
      <Dialog open={previewStatus} footer={null} onClose={previewClose}>
        <img alt="Avatar" style={{ width: '100%' }} src={previewImage} />
      </Dialog>
    </Fragment>
  );
}

export default connect(({ global, PostIncident, loading }) => ({
  global,
  PostIncident,
  loading
}))(PostIncident);
