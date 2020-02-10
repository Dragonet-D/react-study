import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import {
  IVHTable,
  TableToolbar,
  Pagination,
  Permission,
  isPermissionHas,
  ConfirmPage
} from 'components/common';
import materialKeys from 'utils/materialKeys';
import {
  AlarmConfigurationHeader,
  AlarmHandleSelected,
  AlarmConfigAddOrUpdateInfo,
  AlarmConfigDeliveryTo,
  AlarmConfigSetting
} from 'components/Alarm';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { IconButton, Tooltip } from '@material-ui/core';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import { dataUpdatedHandle } from 'utils/helpers';
import { getAlarmInfo, isEventTypesShow } from 'components/Alarm/AlarmConfiguration/utils';
import { handleCheckedItem } from './utils';
import styles from './AlarmConfiguration.module.less';

function AlarmConfiguration(props) {
  const moduleName = 'alarmConfiguration';
  const { dispatch, alarmConfiguration, global } = props;
  const { userId } = global;
  const {
    alarmConfigurationData = {},
    alarmInitInfo = {},
    alarmDetailsOfOne = {},
    channelsData = [],
    deliveryToUserList = {}
  } = alarmConfiguration || {};
  const [dataSource, setDataSource] = useState([]);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [searchParameters, setSearchParameters] = useState('{}');
  const [rowSelectItems, setRowSelectItems] = useState([]);
  const [addOrUpdateCloseStatus, setAddOrUpdateCloseStatus] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [deliveryToDialogStatus, setDeliveryToDialogStatus] = useState(false);
  const [settingDialogStatus, setSettingDialogStatus] = useState(false);
  const [deleteConfirmStatus, setDeleteConfirmStatus] = useState(false);
  const [cameraPageShow, setCameraPageShow] = useState(false);

  const getAlarmConfigurationData = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getAlarmConfigurationList`,
        payload: {
          pageNo,
          pageSize,
          status: 'A',
          userId,
          ...JSON.parse(searchParameters),
          ...obj
        }
      });
    },
    [dispatch, pageNo, pageSize, searchParameters, userId]
  );

  useEffect(() => {
    dispatch({
      type: `${moduleName}/getAlarmInitInfo`
    });
  }, [dispatch]);
  useEffect(() => {
    getAlarmConfigurationData();
  }, [getAlarmConfigurationData]);

  useEffect(() => {
    setDataSource(alarmConfigurationData.items || []);
    setRowSelectItems([]);
  }, [alarmConfigurationData]);

  const columns = [
    {
      title: I18n.t('alarm.config.alarmName'),
      dataIndex: 'alarmName'
    },
    {
      title: I18n.t('alarm.config.eventType'),
      dataIndex: 'eventTypeDescription'
    },
    {
      title: I18n.t('alarm.config.alarmSeverity'),
      dataIndex: 'alarmSeverityDescription'
    },
    {
      title: I18n.t('alarm.config.status'),
      dataIndex: 'alarmStatus'
    }
  ];

  function handleAlarmSettingSave(payload) {
    dispatch({
      type: `${moduleName}/updateAlarmSetting`,
      payload
    }).then(res => {
      dataUpdatedHandle(res, 'Alarm Setting', () => {
        getAlarmConfigurationData();
        setSettingDialogStatus(false);
      });
    });
  }

  function handleDeliveryToSave(payload) {
    dispatch({
      type: `${moduleName}/deliverTo`,
      payload
    }).then(res => {
      dataUpdatedHandle(res, 'Alarm Delivery To', () => {
        getAlarmConfigurationData();
        setDeliveryToDialogStatus(false);
      });
    });
  }

  function handleRowItemSelect(item, event) {
    const { alarmDefinitionUuid } = item;
    const { checked } = event.target;
    setDataSource(dataSource => {
      const data = handleCheckedItem(dataSource, alarmDefinitionUuid, checked);
      setRowSelectItems(data.filter(item => !!item.checked));
      return data;
    });
  }

  const rowSelection = {
    onChange: handleRowItemSelect
  };

  function handleAlarmConfigSearch(obj) {
    setSearchParameters(JSON.stringify(obj));
    setPageNo(0);
  }

  function onChangePage(e, page) {
    setPageNo(page);
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    setPageNo(0);
  }

  function handleChooseAll(e) {
    const { checked } = e.target;
    setDataSource(dataSource => {
      const data = dataSource.map(item => ({ ...item, checked }));
      setRowSelectItems(checked ? data : []);
      return data;
    });
  }
  const getChannelsList = useCallback(
    (obj = {}) => {
      dispatch({
        type: 'alarmConfiguration/getChannelsData',
        payload: {
          userId,
          pageNo: PAGE_NUMBER,
          pageSize: PAGE_SIZE,
          ...obj
        }
      });
    },
    [dispatch, userId]
  );
  function getOneAlarmDetails() {
    dispatch({
      type: `${moduleName}/getAlarmDetailsOfOne`,
      payload: rowSelectItems[0] ? rowSelectItems[0].alarmDefinitionUuid : ''
    });
  }

  function checkOpenCameraPage() {
    const defaultEventTypes = getAlarmInfo(alarmInitInfo, rowSelectItems[0].eventType, 'eventType');
    if (isEventTypesShow(defaultEventTypes)) {
      setCameraPageShow(true);
      getChannelsList();
    }
  }

  function handleHeaderAction(target) {
    switch (target) {
      case 'updateAlarm':
        setDialogTitle(I18n.t('alarm.config.updateAlarm'));
        setAddOrUpdateCloseStatus(true);
        getOneAlarmDetails();
        checkOpenCameraPage();
        break;
      case 'setting':
        setDialogTitle(I18n.t('alarm.config.alarmSettings'));
        setSettingDialogStatus(true);
        getOneAlarmDetails();
        break;
      case 'deliveryTo':
        setDialogTitle(I18n.t('alarm.config.deliveryTo'));
        setDeliveryToDialogStatus(true);
        break;
      default:
        break;
    }
  }

  function handleAddAlarm() {
    setAddOrUpdateCloseStatus(true);
    setDialogTitle(I18n.t('alarm.config.createAlarm'));
    if (!_.isEmpty(alarmDetailsOfOne)) {
      dispatch({
        type: `${moduleName}/clearAlarmDetailsOfOne`
      });
    }
  }

  // alarm update or add save
  function handleSave(e) {
    const isUpdateAlarm = !!rowSelectItems.length;
    if (isUpdateAlarm) {
      const temp = e;
      temp.userId = userId;
      dispatch({
        type: `${moduleName}/updateAlarm`,
        payload: temp
      }).then(res => {
        dataUpdatedHandle(res, 'Update Alarm', () => {
          getAlarmConfigurationData();
          setAddOrUpdateCloseStatus(false);
        });
      });
    } else {
      const temp = e;
      temp.createdId = userId;
      dispatch({
        type: `${moduleName}/createAlarm`,
        payload: temp
      }).then(res => {
        dataUpdatedHandle(res, 'Create Alarm', () => {
          getAlarmConfigurationData();
          setAddOrUpdateCloseStatus(false);
        });
      });
    }
    setCameraPageShow(false);
  }

  function handleDelete() {
    setDeleteConfirmStatus(true);
  }

  function deleteAlarmConfigConfirm() {
    dispatch({
      type: `${moduleName}/deleteAlarmConfiguration`,
      payload: {
        lastUpdatedId: userId,
        ids: rowSelectItems.map(item => item.alarmDefinitionUuid).join(','),
        deleteAlarms: rowSelectItems.map(item => ({
          alarmName: item.alarmName,
          eventType: item.eventType,
          severity: item.alarmSeverity,
          status: item.alarmStatus
        }))
      }
    }).then(res => {
      dataUpdatedHandle(res, 'Alarm Configuration', () => {
        setDeleteConfirmStatus(false);
        getAlarmConfigurationData();
      });
    });
  }

  function deleteAlarmConfigCancel() {
    setDeleteConfirmStatus(false);
  }

  return (
    <>
      {settingDialogStatus && (
        <AlarmConfigSetting
          open={settingDialogStatus}
          onClose={() => setSettingDialogStatus(false)}
          onSave={handleAlarmSettingSave}
          alarmData={alarmDetailsOfOne}
          userId={userId}
        />
      )}
      {deliveryToDialogStatus && (
        <AlarmConfigDeliveryTo
          title={dialogTitle}
          open={deliveryToDialogStatus}
          onClose={() => setDeliveryToDialogStatus(false)}
          deliveryToUserList={deliveryToUserList}
          onSave={handleDeliveryToSave}
          rowSelected={rowSelectItems[0] || {}}
        />
      )}
      {addOrUpdateCloseStatus && (
        <AlarmConfigAddOrUpdateInfo
          alarmData={rowSelectItems[0] || {}}
          alarmConfig={alarmInitInfo}
          open={addOrUpdateCloseStatus}
          closeDialog={e => setAddOrUpdateCloseStatus(e)}
          tableDataSource={channelsData}
          onSave={handleSave}
          title={dialogTitle}
          cameraPageShow={cameraPageShow}
        />
      )}
      <ConfirmPage
        isConfirmPageOpen={deleteConfirmStatus}
        message={I18n.t('alarm.config.deleteAlarmMessage')}
        messageTitle={I18n.t('alarm.config.deleteAlarm')}
        hanldeConfirmMessage={deleteAlarmConfigConfirm}
        handleConfirmPageClose={deleteAlarmConfigCancel}
      />
      <div className={styles.toolbar_wrapper}>
        {rowSelectItems.length > 0 && (
          <AlarmHandleSelected
            materialKey={materialKeys['M4-80']}
            handleDelete={handleDelete}
            numSelected={rowSelectItems}
            iconInfo={{
              icon: 'delete',
              label: 'Delete Alarm'
            }}
          />
        )}
        {isPermissionHas(materialKeys['M4-81']) && (
          <TableToolbar
            handleGetDataByPage={handleAlarmConfigSearch}
            fieldList={[
              ['Alarm Name', 'alarmName', 'iptType'],
              ['Event Type', 'eventType', 'dropdownType'],
              ['Alarm Severity', 'alarmSeverity', 'dropdownType'],
              ['Status', 'alarmStatus', 'dropdownType']
            ]}
            dataList={{
              'Event Type': {
                data: alarmInitInfo && alarmInitInfo.eventType,
                type: 'keyVal',
                id: 0,
                val: 1
              },
              'Alarm Severity': {
                data: alarmInitInfo && alarmInitInfo.alarmSeverity,
                type: 'keyVal',
                id: 0,
                val: 1
              },
              Status: {
                data: ['Enabled', 'Disabled'],
                type: 'normal'
              }
            }}
          >
            <Permission materialKey={materialKeys['M4-63']}>
              <Tooltip title={I18n.t('alarm.config.createAlarm')}>
                <IconButton className={styles.add_alarm} onClick={handleAddAlarm}>
                  <LibraryAddIcon />
                </IconButton>
              </Tooltip>
            </Permission>
          </TableToolbar>
        )}
      </div>
      <AlarmConfigurationHeader
        open={rowSelectItems.length === 1}
        handleAction={handleHeaderAction}
      />
      <Permission materialKey={materialKeys['M4-24']}>
        <IVHTable
          tableMaxHeight="calc(100% - 160px)"
          columns={columns}
          dataSource={dataSource}
          keyId="alarmDefinitionUuid"
          rowSelection={rowSelection}
          handleChooseAll={handleChooseAll}
        />
        <Pagination
          count={alarmConfigurationData.totalNum || 0}
          page={pageNo}
          rowsPerPage={pageSize}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      </Permission>
    </>
  );
}

export default connect(({ global, alarmConfiguration }) => ({
  global,
  alarmConfiguration
}))(AlarmConfiguration);
