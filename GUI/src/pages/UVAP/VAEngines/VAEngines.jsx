import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { Pagination, IVHTable, ConfirmPage, TableToolbar, Permission } from 'components/common';
import {
  OperationTableMenu,
  VapVAEnginesEditDialog,
  VapVAEngineUpgradeDialog,
  VapVAEnginesDetailsDialog
} from 'components/UVAP';
import IconButton from '@material-ui/core/IconButton';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import { dataUpdatedHandle } from 'utils/helpers';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, Link } from '@material-ui/core';
import materialKeys from 'utils/materialKeys';
import Typography from '@material-ui/core/Typography';
import styles from './VAEngines.module.less';
import {
  ENGINES_STATUS_ENABLED,
  ENGINES_STATUS_DISABLED,
  handleEnginesList
  // handleUpdateListData
} from './util';

const useStyles = makeStyles(theme => {
  return {
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
function VAEngines(props) {
  const classes = useStyles(props);
  const { dispatch, global, VAEngines } = props;
  const { userId, commonWebsocketData } = global;
  const moduleName = VAEngines.namespace;
  const { enginesList, engineData, vaGatewayList, labelList, statusList } = VAEngines || {};

  // data init
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [searchParameters, setSearchParameters] = useState({});
  const [mainPageList, setMainPageList] = useState([]);
  const [editDialogStatus, setEditDialogStatus] = useState(false);
  const [upgradeDialogStatus, setUpgradeDialogStatus] = useState(false);
  const [editOpenType, setEditOpenType] = useState('');
  const [currentData, setCurrentData] = useState(engineData);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMsg, setConfirmMsg] = useState('');
  const [engineDetailsStatus, setEngineDetailsStatus] = useState(false);

  // table columns setting
  const columns = [
    {
      title: I18n.t('vap.table.engines.name'),
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
      title: I18n.t('vap.table.engines.label'),
      dataIndex: 'labels',
      render: array => <span>{!_.isEmpty(array) ? array.join(';') : ''}</span>
    },
    {
      title: I18n.t('vap.table.engines.description'),
      dataIndex: 'description'
    },
    {
      title: I18n.t('vap.table.engines.gateway'),
      dataIndex: 'vaGatewayId',
      render: vaGatewayId => (
        <span>
          {vaGatewayList[_.findIndex(vaGatewayList, { id: vaGatewayId })]
            ? vaGatewayList[_.findIndex(vaGatewayList, { id: vaGatewayId })].name
            : ''}
        </span>
      )
    },
    {
      title: I18n.t('vap.table.engines.vender'),
      dataIndex: 'vendor'
    },
    {
      title: I18n.t('vap.table.engines.version'),
      dataIndex: 'providerAppInfo.version'
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
        title: I18n.t('vap.table.engines.operationMenu.update'),
        materialKey: materialKeys['M4-156'],
        action: 'update'
      },
      {
        icon: 'Replay',
        title: I18n.t('vap.table.engines.operationMenu.upgrade'),
        materialKey: materialKeys['M4-154'],
        action: 'upgrade'
      },
      {
        icon: 'RemoveCircleOutline',
        title: I18n.t('vap.table.engines.operationMenu.deactivate'),
        dataIndex: 'status.name',
        data: ENGINES_STATUS_ENABLED,
        action: 'deactivate'
      },
      {
        icon: 'PowerSettingsNew',
        title: I18n.t('vap.table.engines.operationMenu.activate'),
        dataIndex: 'status.name',
        data: ENGINES_STATUS_DISABLED,
        action: 'activate'
      },
      {
        icon: 'Delete',
        title: I18n.t('vap.table.engines.operationMenu.delete'),
        materialKey: materialKeys['M4-157'],
        action: 'delete'
      }
    ]
  };
  function handleGetCurrentDetails(item) {
    getEngineDetails({ id: item.appId });
    setEngineDetailsStatus(true);
  }
  function handleActions(target, data) {
    switch (target) {
      case 'update':
        setEditOpenType('update');
        getEngineDetails({ id: data.appId });
        getVaGateway();
        getLabelList();
        setEditDialogStatus(true);
        break;
      case 'upgrade':
        setUpgradeDialogStatus(true);
        getEngineDetails({ id: data.appId });
        break;
      case 'deactivate':
        handleActivationEngines(data);
        break;
      case 'activate':
        handleActivationEngines(data);
        break;
      case 'delete':
        setCurrentData(data);
        setConfirmTitle(I18n.t('vap.confirm.engines.deleteTitle'));
        setConfirmMsg(I18n.t('vap.confirm.engines.deleteMsg'));
        setConfirmDialog(true);
        break;
      default:
        break;
    }
  }

  const ExtraCell = item => {
    const { appId } = item;
    return (
      <OperationTableMenu
        columns={opertayionMenu}
        key={appId}
        itemId={appId}
        currentData={item}
        getActionData={handleActions}
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

  // confirm page action setting
  function confirmActions() {
    switch (confirmTitle) {
      case I18n.t('vap.confirm.engines.deleteTitle'):
        handleDeleteEngines(currentData);
        setConfirmDialog(false);
        break;
      default:
        break;
    }
  }
  function updateSearchParameters(obj) {
    const data = _.cloneDeep(obj);
    setSearchParameters(data);
    setPageNo(PAGE_NUMBER);
  }
  function onChangePage(e, page) {
    setPageNo(page);
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    setPageNo(PAGE_NUMBER);
  }
  function openEditDialog() {
    setEditOpenType('create');
    getVaGateway();
    getLabelList();
    setEditDialogStatus(true);
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
  const getEnginesListFunc = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getEnginesList`,
        payload: {
          userId,
          pageNo,
          ...searchParameters,
          pageSize,
          ...obj
        }
      });
    },
    [dispatch, moduleName, pageNo, pageSize, searchParameters, userId]
  );

  useEffect(() => {
    if (!_.isEmpty(commonWebsocketData)) {
      // commonWebsocketData.addEventListener('message', e => {
      // const data = JSON.parse(commonWebsocketData || '{}');
      const type = commonWebsocketData.type ? commonWebsocketData.type.toLocaleLowerCase() : '';
      const message = commonWebsocketData.message
        ? commonWebsocketData.message.toLocaleLowerCase()
        : '';
      if (
        type === 'vap' &&
        message === 'Engine'
        // &&
        // _.findIndex(mainPageList, { appId: commonWebsocketData.data.id }) >= 0
      ) {
        // setMainPageList(mainPageList =>
        //   _.cloneDeep(handleUpdateListData(mainPageList, commonWebsocketData, 'appId'))
        // );
        setPageNo(PAGE_NUMBER);
        getEnginesListFunc({ pageNo: PAGE_NUMBER });
      }
      // });
    }
  }, [commonWebsocketData, getEnginesListFunc]);

  function handleSaveEngineDetails(obj = {}) {
    if (editOpenType === 'create') {
      // dispatch({
      //   type: `${moduleName}/createEngine`,
      //   payload: {
      //     userId,
      //     ...obj
      //   }
      // }).then(res => {
      //   dataUpdatedHandle(res, I18n.t('vap.dialog.engines.createTitle'), () => {
      setEditDialogStatus(false);
      setPageNo(PAGE_NUMBER);
      getEnginesListFunc(searchParameters);
      // });
      // });
    } else if (editOpenType === 'update') {
      dispatch({
        type: `${moduleName}/updateEngine`,
        payload: {
          userId,
          ...obj
        }
      }).then(res => {
        dataUpdatedHandle(res, I18n.t('vap.dialog.engines.updateTitle'), () => {
          setEditDialogStatus(false);
          getEnginesListFunc(searchParameters);
        });
      });
    }
  }
  function handleActivationEngines(obj = {}) {
    dispatch({
      type: `${moduleName}/activationEngines`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.table.engines.operationMenu.activationTitle'), () => {
        getEnginesListFunc(searchParameters);
      });
    });
  }
  function handleDeleteEngines(obj = {}) {
    dispatch({
      type: `${moduleName}/deleteEngines`,
      payload: {
        userId,
        ...obj
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.table.engines.operationMenu.deleteTitle'), () => {
        getEnginesListFunc(searchParameters);
      });
    });
  }
  function upgradeEngine() {
    // dispatch({
    //   type: `${moduleName}/upgradeEngine`,
    //   payload: {
    //     userId,
    //     ...obj
    //   }
    // }).then(res => {
    //   dataUpdatedHandle(res, I18n.t('vap.dialog.engines.upgradeTitle'), () => {
    setUpgradeDialogStatus(false);
    getEnginesListFunc(searchParameters);
    //   });
    // });
  }
  function getEngineDetails(obj = {}) {
    dispatch({
      type: `${moduleName}/getEngineDetails`,
      payload: {
        userId,
        ...obj
      }
    });
  }
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

  const getLabelList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getLabelList`,
        payload: {
          userId,
          codeCategory: ['VAP_LABELS'],
          ...obj
        }
      });
    },
    [dispatch, moduleName, userId]
  );

  // get main page data
  useEffect(() => {
    getLabelList();
    getVaGateway();
    getEngineStatusList();
  }, [getEngineStatusList, getLabelList, getVaGateway]);
  useEffect(() => {
    getEnginesListFunc({ ...searchParameters, pageNo, pageSize });
  }, [getEnginesListFunc, pageNo, pageSize, searchParameters]);
  useEffect(() => {
    setMainPageList(handleEnginesList(enginesList.items) || []);
  }, [enginesList]);
  useEffect(() => {
    setCurrentData(engineData || {});
  }, [engineData]);
  useEffect(() => {
    setCurrentData({});
  }, [upgradeDialogStatus, editDialogStatus]);

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

      {upgradeDialogStatus && (
        <VapVAEngineUpgradeDialog
          open={upgradeDialogStatus}
          onClose={() => setUpgradeDialogStatus(false)}
          onSave={upgradeEngine}
          engineData={currentData}
          userId={userId}
        />
      )}
      {editDialogStatus && (
        <VapVAEnginesEditDialog
          open={editDialogStatus}
          onClose={() => setEditDialogStatus(false)}
          onSave={handleSaveEngineDetails}
          engineData={currentData}
          userId={userId}
          vaGatewayList={vaGatewayList}
          editOpenType={editOpenType}
          labelList={labelList}
          userId={userId}
        />
      )}
      {engineDetailsStatus && (
        <VapVAEnginesDetailsDialog
          detailsDialogStatus={engineDetailsStatus}
          close={() => setEngineDetailsStatus(false)}
          data={engineData}
          statusList={statusList}
          vaGatewayList={vaGatewayList}
        />
      )}
      <TableToolbar
        handleGetDataByPage={updateSearchParameters}
        fieldList={[
          ['VA_Name', 'name', 'iptType'],
          ['Status', 'statusName', 'dropdownType'],
          ['VA_Label', 'labels', 'dropdownType'],
          ['VA_Description', 'description', 'iptType'],
          ['VA_Gateway', 'vaGatewayId', 'dropdownType'],
          ['Vendor', 'vendor', 'iptType'],
          ['VA_Version', 'appVersion', 'iptType']
        ]}
        dataList={{
          VA_Label: {
            data: labelList,
            type: 'keyVal',
            id: 'codeDesc',
            val: 'codeValue'
          },
          Status: {
            data: statusList,
            type: 'keyVal',
            id: 'codeValue',
            val: 'codeDesc'
          },
          VA_Gateway: {
            data: vaGatewayList,
            type: 'keyVal',
            id: 'id',
            val: 'name'
          }
        }}
      >
        <Permission materialKey={materialKeys['M4-155']}>
          <Tooltip title={I18n.t('vap.toolbar.engines.createEngine')}>
            <IconButton className={styles.add_alarm} onClick={openEditDialog}>
              <LibraryAddIcon />
            </IconButton>
          </Tooltip>
        </Permission>
      </TableToolbar>
      <Permission materialKey={materialKeys['M4-35']}>
        <IVHTable keyId="appId" columns={columns} dataSource={mainPageList} extraCell={extraCell} />
        <Pagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={_.parseInt(enginesList.totalNum) || 0}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      </Permission>
    </Fragment>
  );
}

export default connect(({ global, VAEngines, loading }) => ({ global, VAEngines, loading }))(
  VAEngines
);
