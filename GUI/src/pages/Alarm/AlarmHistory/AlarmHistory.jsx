import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { I18n } from 'react-i18nify';
import { Pagination, IVHTable, Permission } from 'components/common';
import materialKeys from 'utils/materialKeys';
import {
  AlarmHistoryDialog,
  SearchHeaderWithExport,
  AlarmHistoryAction,
  AlarmItemView
} from 'components/Alarm';
import { PAGE_NUMBER, PAGE_SIZE, DATE_FORMAT } from 'commons/constants/const';
import { getStartTime, getEndTime } from 'utils/dateHelper';
import { dataUpdatedHandle } from 'utils/helpers';
import msg from 'utils/messageCenter';
import {
  handleAlarmHistory,
  handleCheckedItem,
  handleActionData,
  handleViewDataForShowing
} from './utils';

function AlarmHistory(props) {
  const moduleName = 'alarmHistory';
  const { dispatch, global, alarmHistory } = props;
  const { userId } = global;
  const {
    alarmHistoryData,
    alarmHistoryExportData,
    alarmInitInfo,
    alarmHistoryActionData
  } = alarmHistory;

  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [dialogStatus, setDialogStatus] = useState(false);
  const [startTime, setStartTime] = useState(getStartTime());
  const [endTime, setEndTime] = useState(getEndTime());
  const [searchParameters, setSearchParameters] = useState('{}');
  const [rowSelectItems, setRowSelectItems] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [actionData, setActionData] = useState({});
  const [actionType, setActionType] = useState('');
  const [viewDataStatus, setViewDataStatus] = useState(false);

  const getAlarmHistoryList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getAlarmHistoryData`,
        payload: {
          userId,
          sort: [{ key: 'time', sort: 'desc' }],
          pageNo,
          pageSize,
          ...JSON.parse(searchParameters),
          ...obj,
          startTime: moment(startTime).format('YYYY-MM-DDTHH:mm:ss'),
          endTime: moment(endTime).format('YYYY-MM-DDTHH:mm:ss')
        }
      });
    },
    [dispatch, endTime, pageNo, pageSize, searchParameters, startTime, userId]
  );

  // get initial system config
  useEffect(() => {
    dispatch({
      type: `${moduleName}/getAlarmInitInfo`
    });
  }, [dispatch]);

  // update alarm history list
  useEffect(() => {
    getAlarmHistoryList();
  }, [getAlarmHistoryList]);

  useEffect(() => {
    setDataSource(handleAlarmHistory(alarmHistoryData.items || []));
    setRowSelectItems([]);
  }, [alarmHistoryData]);

  useEffect(() => {
    return () => {
      dispatch({
        type: `${moduleName}/clearAlarmHistoryActionData`
      });
    };
  }, [alarmHistoryExportData, dispatch]);

  function onChangePage(e, page) {
    setPageNo(page);
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    setPageNo(0);
  }
  const columns = [
    {
      title: I18n.t('alarm.config.sentTime'),
      dataIndex: 'time',
      render: text => <span>{moment(text).format(DATE_FORMAT)}</span>,
      width: 100
    },
    {
      title: I18n.t('alarm.config.eventType'),
      dataIndex: 'alarmType',
      width: 70
    },
    {
      title: I18n.t('alarm.config.source'),
      dataIndex: 'sourceName',
      width: 70
    },
    {
      title: I18n.t('alarm.config.data'),
      dataIndex: 'data',
      width: 250
    },
    {
      title: I18n.t('alarm.config.owner'),
      dataIndex: 'ownedBy',
      width: 70
    },
    {
      title: I18n.t('alarm.config.status'),
      dataIndex: 'status',
      width: 70
    }
  ];

  function updateHistoryAction(data, status) {
    const { alarmDetailsUuid, note } = data;
    dispatch({
      type: `${moduleName}/updateAlarmHistoryAction`,
      payload: {
        alarmDetailsUuid,
        userId,
        status,
        comments: note
      }
    })
      .then(res => {
        dataUpdatedHandle(res, I18n.t('alarm.history.alarmHistory'), () => {
          setDialogStatus(false);
          getAlarmHistoryList();
        });
      })
      .catch(e => {
        if (e && e.message) {
          msg.error(e.message, I18n.t('alarm.history.alarmHistory'));
        }
      });
  }

  function handleActionOrView(data) {
    dispatch({
      type: `${moduleName}/getAlarmHistoryAction`,
      payload: data.status
    });
  }

  function handleActions(target, data) {
    switch (target) {
      case 'View':
        setActionData(data);
        setViewDataStatus(true);
        setActionType(target);
        break;
      case 'Action':
        handleActionOrView(data);
        setActionData(data);
        setDialogStatus(true);
        setActionType(target);
        break;
      case 'Handling':
        updateHistoryAction(data, 'Handling');
        break;
      case 'Release':
        updateHistoryAction(data, 'Open');
        break;
      case 'Close':
        updateHistoryAction(data, 'Closed');
        break;
      default:
        break;
    }
  }

  function handleDialogClose() {
    setDialogStatus(false);
  }
  function handleHistorySearch(obj) {
    if (obj.startTime) {
      setStartTime(obj.startTime);
    }
    if (obj.endTime) {
      setEndTime(obj.endTime);
    }
    setPageNo(0);
    setSearchParameters(JSON.stringify(obj));
  }

  function handleExport() {
    dispatch({
      type: `${moduleName}/exportAlarmHistoryData`,
      payload: { userId, startTime, endTime }
    });
  }

  function handleRowSelection(item, event) {
    const { alarmDetailsUuid } = item;
    const { checked } = event.target;
    setDataSource(dataSource => {
      const data = handleCheckedItem(dataSource, alarmDetailsUuid, checked);
      setRowSelectItems(data.filter(item => !!item.checked));
      return data;
    });
  }

  const rowSelection = {
    onChange: handleRowSelection
  };

  function handleChooseAll(e) {
    const { checked } = e.target;
    setDataSource(dataSource => {
      const data = dataSource.map(item => ({ ...item, checked }));
      setRowSelectItems(checked ? data : []);
      return data;
    });
  }

  function handleActionSubmit(e) {
    if (e.file) {
      dispatch({
        type: `${moduleName}/updateAlarmHistoryDetails`,
        payload: e
      })
        .then(res => {
          dataUpdatedHandle(res, I18n.t('alarm.history.alarmHistory'), () => {
            setDialogStatus(false);
            getAlarmHistoryList();
          });
        })
        .catch(e => {
          if (e && e.message) {
            msg.error(e.message, I18n.t('alarm.history.alarmHistory'));
          }
        });
    } else {
      dispatch({
        type: `${moduleName}/updateAlarmHistoryDetailsNoFile`,
        payload: e
      })
        .then(res => {
          dataUpdatedHandle(res, I18n.t('alarm.history.alarmHistory'), () => {
            setDialogStatus(false);
            getAlarmHistoryList();
          });
        })
        .catch(e => {
          if (e && e.message) {
            msg.error(e.message, I18n.t('alarm.history.alarmHistory'));
          }
        });
    }
  }

  function handleDownload(id) {
    dispatch({
      type: `${moduleName}/alarmHistoryDownload`,
      payload: id
    });
  }

  function handlePreviewClose() {
    setViewDataStatus(false);
  }

  return (
    <>
      <AlarmItemView
        title={I18n.t('alarm.history.alarmDetails')}
        dataSource={handleViewDataForShowing(actionData)}
        invokeDownload={handleDownload}
        open={viewDataStatus}
        handleClose={handlePreviewClose}
      />
      {dialogStatus && (
        <AlarmHistoryDialog
          open={dialogStatus}
          handleClose={handleDialogClose}
          dataSource={actionData}
          actionData={handleActionData(alarmHistoryActionData)}
          actionType={actionType}
          handleSubmit={handleActionSubmit}
          userId={userId}
          onDownload={handleDownload}
        />
      )}
      <Permission materialKey={materialKeys['M4-19']}>
        <SearchHeaderWithExport
          downloadMaterialKey={materialKeys['M4-111']}
          exportData={alarmHistoryExportData}
          handleSearch={handleHistorySearch}
          fieldList={[
            ['Source', 'sourceName', 'iptType'],
            ['Event Type', 'alarmType', 'dropdownType'],
            ['Status', 'status', 'dropdownType'],
            ['Range', 'range', 'rangeType']
          ]}
          dataList={{
            'Event Type': {
              data: alarmInitInfo.eventType || [],
              type: 'keyVal',
              id: 0,
              val: 1
            },
            Status: {
              data: ['Open', 'Handling', 'Close'],
              type: 'normal'
            }
          }}
          handleExport={handleExport}
        />
      </Permission>
      <AlarmHistoryAction
        componentTarget="alarmHistory"
        dataSource={rowSelectItems}
        userId={userId}
        open={rowSelectItems.length > 0}
        getActionData={handleActions}
      />
      <IVHTable
        tableMaxHeight={rowSelectItems.length === 1 ? 'calc(100% - 192px)' : 'calc(100% - 156px)'}
        handleChooseAll={handleChooseAll}
        rowSelection={rowSelection}
        keyId="alarmDetailsUuid"
        columns={columns}
        dataSource={dataSource}
      />
      <Pagination
        page={pageNo}
        rowsPerPage={pageSize}
        count={alarmHistoryData.totalNum || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </>
  );
}

export default connect(({ global, alarmHistory }) => ({ global, alarmHistory }))(AlarmHistory);
