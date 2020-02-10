/* eslint-disable no-unused-vars */
import React, { Fragment, useState, useEffect, useReducer, useCallback } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { Pagination, IVHTable, ConfirmPage, ToolTip } from 'components/common';
import {
  LicenseFilterToolbar,
  OperationTableMenu,
  LicenseCreateDialog,
  LicenseEditDIalog,
  LicenseKeyDialog
} from 'components/UVAP';
import { isSuccess, dataUpdatedHandle } from 'utils/helpers';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import {
  CameraUsageChart,
  UserStateChart,
  OverviewDetails,
  LicenseManagementChart,
  VAInstanceResourceUsageChart,
  LicenseManagement,
  InstanceOverviewChart
} from 'components/Overview';
import msgCenter from 'utils/messageCenter';
import {
  LICENSE_STATUS_ENABLED,
  LICENSE_STATUS_DISABLED,
  LICENSE_STATUS_STRING,
  LICENSE_STATUS_FILE,
  handleLicenseList
} from './util';
import { deleteLicenseApi } from '../../../api/vap';

const useStyles = makeStyles(() => ({
  rightButtom: {
    position: 'absolute',
    right: '0',
    paddingRight: '12px !important',
    marginRight: '24px'
  }
}));

// const pageInfoReducer = (pageInfo, action) => {
//   switch (action.type) {
//     case 'pindex':
//       return { ...pageInfo, pindex: action.data };
//     case 'psize':
//       return { ...pageInfo, psize: action.data };
//     default:
//       throw new Error();
//   }
// };
// const enginesPageInfoReducer = (pageInfo, action) => {
//   switch (action.type) {
//     case 'pindex':
//       return { ...pageInfo, pindex: action.data };
//     case 'psize':
//       return { ...pageInfo, psize: action.data };
//     default:
//       throw new Error();
//   }
// };
// const paramsAction = (paramsInfo, action) => {
//   switch (action.type) {
//     case 'reset':
//       return {};
//     case 'engineId':
//       return { ...paramsInfo, engineId: action.data };
//     default:
//       throw new Error();
//   }
// };

function License(props) {
  const classes = useStyles();
  const { dispatch, global, License } = props;
  const { userId } = global;
  const moduleName = License.namespace;
  const [tableSource, setTableSource] = useState({});
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [targetChart, setTargetChart] = useState(null);
  const { licenseList, licenseChart, engineStatusList, vaGatewayList } = License || {};
  const [distributionSource, setDistributionSource] = useState([]);

  const getLicenseChart = useCallback(() => {
    dispatch({
      type: `${moduleName}/getLicenseChart`,
      payload: {
        userId
      }
    });
  }, [dispatch, moduleName, userId]);

  // data init and change page
  useEffect(() => {
    setTableSource({ items: licenseList.items, totalNum: licenseList.totalNum });
  }, [licenseList, pageNo, pageSize]);

  // init chart
  useEffect(() => {
    setTargetChart(
      <LicenseManagementChart
        dataSource={licenseChart || {}}
        title={I18n.t('overview.title.licenseManagement')}
        // callShowDetails={callShowDetails}
        caseOfSwitch="licenseManagement"
        isTitleNeeded={false}
      />
    );
  }, [licenseChart]);

  const getLicenseList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getLicenseList`,
        payload: {
          pageNo,
          pageSize,
          userId,
          ...obj,
          param: obj.param ? obj.param : {}
        }
      });
    },
    [dispatch, moduleName, pageNo, pageSize, userId]
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

  useEffect(() => {
    getLicenseList();
    getLicenseChart();
    getVaGateway();
    getEngineStatusList();
  }, [getEngineStatusList, getLicenseChart, getLicenseList, getVaGateway]);

  function handleGetDataByPage(pageNo, pageSize) {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }

  function handleGetDistribution(appId) {
    dispatch({
      type: `${moduleName}/getDistribution`,
      payload: { appId, userId }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        if (res.data) {
          setDistributionSource(res.data.map((item, index) => ({ ...item, _id: index })));
        }
      } else {
        msgCenter.warn(res.message, '');
      }
    });
  }

  function handleUploadLicense(obj = {}) {
    return dispatch({
      type: `${moduleName}/uploadLicense`,
      payload: { ...obj, userId }
    });
  }

  function saveDistribution(assignLicenseList, appId) {
    dispatch({
      type: `${moduleName}/saveDistribution`,
      payload: assignLicenseList
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('overview.title.saveDistribution'), () => {
        handleGetDistribution(appId);
      });
    });
  }

  //   const { enginesList, licenseList, licenseKey } = License || {};
  //   const [dataSource, setDataSource] = useState([]);
  //   const [pageInfo, dispatchPageInfo] = useReducer(pageInfoReducer, {
  //     pindex: PAGE_NUMBER,
  //     psize: PAGE_SIZE
  //   });
  //   const [enginesPageInfo, dispatchEnginesPageInfo] = useReducer(enginesPageInfoReducer, {
  //     pindex: PAGE_NUMBER,
  //     psize: PAGE_SIZE
  //   });

  //   const [totalNum, setTotalNum] = useState(0);

  //   const [params, dispatchParams] = useReducer(paramsAction, {});

  //   const [currentData, setCurrentData] = useState({});
  //   const [confirmDialog, setConfirmDialog] = useState(false);
  //   const [confirmTitle, setConfirmTitle] = useState('');
  //   const [confirmMsg, setConfirmMsg] = useState('');
  //   const [confirmType, setConfirmType] = useState('');

  //   // create dialog init
  //   const [createDialogStatus, setCreateDialogStatus] = useState(false);
  //   // edit dialog init
  //   const [editDialogStatus, setEditDialogStatus] = useState(false);
  //   const [editOpenType, setEditOpenType] = useState('');
  //   // key dialog init
  //   const [keyDialogStatus, setKeyDialogStatus] = useState(false);
  //   // confirm page action setting
  //   function confirmActions() {
  //     switch (confirmType) {
  //       case 'delete':
  //         deleteLicense();
  //         setConfirmDialog(false);
  //         break;
  //       case 'deactivate':
  //         deactivateLicense();
  //         setConfirmDialog(false);
  //         break;
  //       case 'activate':
  //         acrivateLicense();
  //         setConfirmDialog(false);
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  //   const getEnginesList = useCallback(
  //     (obj = {}) => {
  //       dispatch({
  //         type: `${moduleName}/getEnginesList`,
  //         payload: {
  //           userId,
  //           ...enginesPageInfo,
  //           ...obj
  //         }
  //       });
  //     },
  //     [dispatch, enginesPageInfo, moduleName, userId]
  //   );

  //   useEffect(() => {
  //     getEnginesList();
  //   }, [getEnginesList]);
  //   useEffect(() => {
  //     setDataSource(handleLicenseList(licenseList));
  //   }, [licenseList]);

  //   const getLicenseKey = useCallback(
  //     (obj = {}) => {
  //       dispatch({
  //         type: `${moduleName}/getLicenseKey`,
  //         payload: {
  //           userId,
  //           appId: currentData.appId,
  //           licenseId: currentData.id,
  //           ...obj
  //         }
  //       });
  //     },
  //     [currentData.appId, currentData.id, dispatch, moduleName, userId]
  //   );
  //   useEffect(() => {
  //     if (keyDialogStatus) getLicenseKey();
  //   }, [getLicenseKey, keyDialogStatus]);
  //   // table columns setting
  //   const columns = [
  //     {
  //       title: I18n.t('vap.table.license.id'),
  //       dataIndex: 'id'
  //     },
  //     {
  //       title: I18n.t('vap.table.license.keyType'),
  //       dataIndex: 'keyType'
  //     },
  //     {
  //       title: I18n.t('vap.table.license.status'),
  //       render: item => <span>{_.toString(item.enabled)}</span>
  //     }
  //   ];
  //   // table operation menu setting
  //   const opertayionMenu = {
  //     tipName: I18n.t('vap.table.common.operationMenu.tipName'),
  //     titleName: I18n.t('vap.table.common.operationMenu.name'),
  //     icon: 'MoreVert',
  //     items: [
  //       {
  //         icon: 'Tune',
  //         title: I18n.t('vap.table.license.operationMenu.update'),
  //         action: 'update'
  //       },
  //       {
  //         icon: 'RemoveCircleOutline',
  //         title: I18n.t('vap.table.license.operationMenu.deactivate'),
  //         dataIndex: 'enabled',
  //         data: LICENSE_STATUS_ENABLED,
  //         action: 'deactivate'
  //       },
  //       {
  //         icon: 'PowerSettingsNew',
  //         title: I18n.t('vap.table.license.operationMenu.activate'),
  //         dataIndex: 'enabled',
  //         data: LICENSE_STATUS_DISABLED,
  //         action: 'activate'
  //       },
  //       {
  //         icon: 'Delete',
  //         title: I18n.t('vap.table.license.operationMenu.delete'),
  //         action: 'delete'
  //       },
  //       {
  //         icon: 'Search',
  //         title: I18n.t('vap.table.license.operationMenu.getKey'),
  //         dataIndex: 'keyType',
  //         data: LICENSE_STATUS_STRING,
  //         action: 'getKey'
  //       },
  //       {
  //         icon: 'CloudDownload',
  //         title: I18n.t('vap.table.license.operationMenu.download'),
  //         dataIndex: 'keyType',
  //         data: LICENSE_STATUS_FILE,
  //         action: 'download'
  //       }
  //     ]
  //   };

  //   function handleActions(target, data) {
  //     switch (target) {
  //       case 'update':
  //         setCurrentData(data);
  //         setEditOpenType('update');
  //         setEditDialogStatus(true);
  //         break;
  //       case 'getKey':
  //         setCurrentData(data);
  //         setKeyDialogStatus(true);
  //         break;
  //       case 'download':
  //         setCurrentData(data);
  //         downloadLicenseKey({ appId: data.appId, licenseId: data.id });
  //         break;
  //       case 'deactivate':
  //         setCurrentData(data);
  //         setConfirmTitle(I18n.t('vap.confirm.license.deactivateTitle'));
  //         setConfirmMsg(I18n.t('vap.confirm.license.deactivateMsg'));
  //         setConfirmType(target);
  //         setConfirmDialog(true);
  //         break;
  //       case 'activate':
  //         setCurrentData(data);
  //         setConfirmTitle(I18n.t('vap.confirm.license.activateTitle'));
  //         setConfirmMsg(I18n.t('vap.confirm.license.activateMsg'));
  //         setConfirmType(target);
  //         setConfirmDialog(true);
  //         break;
  //       case 'delete':
  //         setCurrentData(data);
  //         setConfirmTitle(I18n.t('vap.confirm.license.deleteTitle'));
  //         setConfirmMsg(I18n.t('vap.confirm.license.deleteMsg'));
  //         setConfirmType(target);
  //         setConfirmDialog(true);
  //         break;
  //       default:
  //         break;
  //     }
  //   }

  //   const ExtraCell = item => {
  //     const { id } = item;
  //     return (
  //       <OperationTableMenu
  //         columns={opertayionMenu}
  //         key={id}
  //         itemId={id}
  //         currentData={item}
  //         getActionData={handleActions}
  //       />
  //     );
  //   };

  //   const extraCell = {
  //     columns: [
  //       {
  //         title: I18n.t('vap.table.common.operation'),
  //         dataIndex: ''
  //       }
  //     ],
  //     components: [
  //       {
  //         component: ExtraCell,
  //         key: '12'
  //       }
  //     ]
  //   };
  //   // toolbar button runder
  //   const CreateButtonRender = () => (
  //     <ToolTip title={I18n.t('vap.toolbar.license.createBtnMsg')} className={classes.rightButtom}>
  //       <IconButton
  //         aria-label={I18n.t('vap.toolbar.license.createBtnMsg')}
  //         onClick={() => setCreateDialogStatus(true)}
  //       >
  //         <LibraryAdd style={{ color: 'ffa517' }} />
  //       </IconButton>
  //     </ToolTip>
  //   );
  //   // page func
  //   function onChangePage(e, page) {
  //     dispatchPageInfo({ type: 'pindex', data: page });
  //     setTotalNum({});
  //   }
  //   function onChangeRowsPerPage(e) {
  //     const { value } = e.target;
  //     dispatchPageInfo({ type: 'psize', data: value });
  //     setTotalNum({});
  //   }
  //   function handleGetLicenseList(id) {
  //     dispatchParams({ type: 'engineId', data: id });
  //     getLicenseList({ engineId: id });
  //   }

  //   function getLicenseList(obj = {}) {
  //     dispatch({
  //       type: `${moduleName}/getLicenseList`,
  //       payload: {
  //         userId,
  //         ...params,
  //         ...pageInfo,
  //         ...obj
  //       }
  //     });
  //   }
  //   function deleteLicense(obj = {}) {
  //     dispatch({
  //       type: `${moduleName}/deleteLicense`,
  //       payload: {
  //         userId,
  //         appId: currentData.appId,
  //         licenseId: currentData.id,
  //         ...obj
  //       }
  //     }).then(res => {
  //       dataUpdatedHandle(res, I18n.t('vap.table.license.operationMenu.deleteTitle'), () => {
  //         getLicenseList();
  //       });
  //     });
  //   }
  //   function deactivateLicense(obj = {}) {
  //     dispatch({
  //       type: `${moduleName}/licenseAction`,
  //       payload: {
  //         userId,
  //         appId: currentData.appId,
  //         licenseId: currentData.id,
  //         enabled: false,
  //         ...obj
  //       }
  //     }).then(res => {
  //       dataUpdatedHandle(res, I18n.t('vap.table.license.operationMenu.deactivateTitle'), () => {
  //         getLicenseList();
  //       });
  //     });
  //   }
  //   function acrivateLicense(obj = {}) {
  //     dispatch({
  //       type: `${moduleName}/licenseAction`,
  //       payload: {
  //         userId,
  //         appId: currentData.appId,
  //         licenseId: currentData.id,
  //         enabled: true,
  //         ...obj
  //       }
  //     }).then(res => {
  //       dataUpdatedHandle(res, I18n.t('vap.table.license.operationMenu.deactivateTitle'), () => {
  //         getLicenseList();
  //       });
  //     });
  //   }
  //   function createNewLicense(obj = {}) {
  //     dispatch({
  //       type: `${moduleName}/createNewLicense`,
  //       payload: {
  //         userId,
  //         ...obj
  //       }
  //     }).then(res => {
  //       dataUpdatedHandle(res, I18n.t('vap.dialog.license.createTitle'), () => {
  //         getLicenseList();
  //         setCreateDialogStatus(false);
  //       });
  //     });
  //   }
  //   function updateLicense(obj = {}) {
  //     dispatch({
  //       type: `${moduleName}/updateLicense`,
  //       payload: {
  //         userId,
  //         appId: currentData.appId,
  //         licenseId: currentData.id,
  //         ...obj
  //       }
  //     }).then(res => {
  //       dataUpdatedHandle(res, I18n.t('vap.dialog.license.updateTitle'), () => {
  //         getLicenseList();
  //         setEditDialogStatus(false);
  //       });
  //     });
  //   }

  //   function downloadLicenseKey(obj = {}) {
  //     dispatch({
  //       type: `${moduleName}/downloadLicenseKey`,
  //       payload: {
  //         userId,
  //         appId: currentData.appId,
  //         licenseId: currentData.id,
  //         ...obj
  //       }
  //     }).then(res => {
  //       dataUpdatedHandle(res, I18n.t('vap.table.license.operationMenu.download'));
  //     });
  //   }

  return (
    <Fragment>
      {/* {keyDialogStatus && (
        <LicenseKeyDialog
          licenseKey={licenseKey}
          open={keyDialogStatus}
          loading={loading.effects[`${moduleName}/getLicenseKey`]}
          onClose={() => setKeyDialogStatus(false)}
        />
      )}
      {createDialogStatus && (
        <LicenseCreateDialog
          open={createDialogStatus}
          onClose={() => setCreateDialogStatus(false)}
          onSave={createNewLicense}
          enginesList={enginesList}
          loading={loading.effects[`${moduleName}/getEnginesList`]}
        />
      )}
      {editDialogStatus && (
        <LicenseEditDIalog
          open={editDialogStatus}
          onClose={() => setEditDialogStatus(false)}
          onSave={updateLicense}
          currentData={currentData}
          editOpenType={editOpenType}
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
      <LicenseFilterToolbar
        enginesList={enginesList}
        handleGetLicenseList={handleGetLicenseList}
        params={params}
        buttonRender={CreateButtonRender}
      />
      <IVHTable
        // tableMaxHeight={rowSelectItems.length > 0 ? 'calc(100% - 196px)' : 'calc(100% - 160px)'}
        // handleChooseAll={handleChooseAll}
        // rowSelection={rowSelection}
        keyId="id"
        columns={columns}
        dataSource={dataSource}
        loading={
          loading.effects[`${moduleName}/licenseAction`] ||
          loading.effects[`${moduleName}/getEnginesList`] ||
          loading.effects[`${moduleName}/deleteLicense`] ||
          loading.effects[`${moduleName}/getLicenseList`]
        }
        extraCell={extraCell}
      />
      <Pagination
        page={pageInfo.pindex}
        rowsPerPage={pageInfo.psize}
        count={_.parseInt(totalNum) || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      /> */}

      <LicenseManagement
        independentModule
        detailTitle={I18n.t('overview.title.licenseManagement')}
        dataSource={tableSource}
        targetChart={targetChart}
        handleGetDataByPage={(pageNo, pageSize, obj) =>
          getLicenseList({ pageNo, pageSize, param: obj })
        }
        handleGetDistribution={handleGetDistribution}
        distributionSource={distributionSource}
        setDistributionSource={setDistributionSource}
        handleUploadLicense={handleUploadLicense}
        saveDistribution={saveDistribution}
        userId={userId}
        getTableData={(pageNo, pageSize) => getLicenseList({ pageNo, pageSize })}
        engineStatusList={engineStatusList}
        vaGatewayList={vaGatewayList}
      />
    </Fragment>
  );
}

export default connect(({ global, License, loading }) => ({
  global,
  License,
  loading
}))(License);
