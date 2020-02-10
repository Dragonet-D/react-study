import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { I18n } from 'react-i18nify';
import { Pagination, IVHTable, Download, FormatJSONShow } from 'components/common';
import _ from 'lodash';
import {
  AlarmHistoryDialog,
  AlarmHistoryAction,
  handleCheckedItem,
  AlarmItemView
} from 'components/Alarm';
import { dataUpdatedHandle } from 'utils/helpers';
import msg from 'utils/messageCenter';
import { PAGE_NUMBER, PAGE_SIZE, DATE_FORMAT } from 'commons/constants/const';
import { handlePaginationFront } from 'utils/utils';
import { handleActionData, handleViewDataForShowing } from './utils';

function AlarmHistory(props) {
  const moduleName = 'alarmRealtime';
  const {
    dispatch,
    global: { userId, commonWebsocketData },
    alarmRealtime: { alarmRealtimeData, alarmRealtimeExportData, alarmRealtimeActionData },
    getChildRowSelectItems
  } = props;
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [dialogStatus, setDialogStatus] = useState(false);
  const [viewDataStatus, setViewDataStatus] = useState(false);
  const [actionData, setActionData] = useState({});
  const [actionType, setActionType] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [rowSelectItems, setRowSelectItems] = useState([]);
  const setAlarmWSData = useState({})[1];

  useEffect(() => {
    if (!_.isEmpty(commonWebsocketData)) {
      setAlarmWSData(prev => {
        if (!_.isEqual(prev, commonWebsocketData)) {
          if (commonWebsocketData.type === 'VMS_REAL_TIME') {
            const wsDataTemp = _.get(commonWebsocketData, 'data.data', '');
            if (wsDataTemp && _.isArray(wsDataTemp)) {
              setDataSource(prevDataSource => {
                return [..._.get(commonWebsocketData, 'data.data', []), ...prevDataSource];
              });
            }
          }
          return commonWebsocketData;
        }
      });
    }
  }, [commonWebsocketData, setAlarmWSData]);

  const getAlarmRealtimeList = useCallback(
    (sort = 'desc') => {
      const sortList = [{ key: 'time', sort }];
      dispatch({
        type: `${moduleName}/getAlarmRealtimeData`,
        payload: {
          sort: sortList,
          userId
        }
      });
    },
    [dispatch, userId]
  );

  useEffect(() => {
    getAlarmRealtimeList();
  }, [getAlarmRealtimeList]);

  useEffect(() => {
    setDataSource(handlePaginationFront(alarmRealtimeData, pageSize, pageNo));
    setRowSelectItems([]);
  }, [alarmRealtimeData, pageNo, pageSize]);

  useEffect(() => {
    return () => {
      dispatch({
        type: `${moduleName}/clearAlarmRealtimeActionData`
      });
      dispatch({
        type: `${moduleName}/clearAllTheData`
      });
    };
  }, [dispatch]);

  function onChangePage(e, page) {
    setPageNo(page);
    setRowSelectItems([]);
    setDataSource(handlePaginationFront(alarmRealtimeData, pageSize, page));
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    setRowSelectItems([]);
    setDataSource(handlePaginationFront(alarmRealtimeData, value, pageNo));
  }
  const columns = useMemo(
    () => [
      {
        title: I18n.t('alarm.config.sentTime'),
        dataIndex: 'time',
        render: text => <span>{moment(text).format(DATE_FORMAT)}</span>,
        sorter: {
          order: 'desc',
          active: true
        },
        width: 120
      },
      {
        title: I18n.t('alarm.config.eventType'),
        dataIndex: 'alarmTypeDesc',
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
        width: 150
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
    ],
    []
  );

  function updateRealtimeAction(data, status) {
    const { alarmDetailsUuid, note } = data;
    dispatch({
      type: `${moduleName}/updateAlarmRealtimeAction`,
      payload: {
        alarmDetailsUuid,
        userId,
        status,
        comments: note
      }
    })
      .then(res => {
        dataUpdatedHandle(res, 'Alarm Rel-time', () => {
          setDialogStatus(false);
          getAlarmRealtimeList();
        });
      })
      .catch(e => {
        if (e && e.message) {
          msg.error(e.message, 'Alarm Real-time');
        }
      });
  }

  function handleActionOrView(data) {
    dispatch({
      type: `${moduleName}/getAlarmRealtimeAction`,
      payload: data.status
    })
      .then(res => {
        dataUpdatedHandle(res, 'Alarm Rel-time', () => {
          setDialogStatus(false);
          getAlarmRealtimeList();
        });
      })
      .catch(e => {
        if (e && e.message) {
          msg.error(e.message, 'Alarm Real-time');
        }
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
        updateRealtimeAction(data, 'Handling');
        break;
      case 'Release':
        updateRealtimeAction(data, 'Open');
        break;
      case 'Close':
        updateRealtimeAction(data, 'Closed');
        break;
      default:
        break;
    }
  }

  function handleDialogClose() {
    setDialogStatus(false);
  }

  function handleRowSelection(item, event) {
    const { alarmDetailsUuid } = item;
    const { checked } = event.target;
    setDataSource(dataSource => {
      const data = handleCheckedItem(dataSource, alarmDetailsUuid, checked, 'alarmDetailsUuid');
      setRowSelectItems(data.filter(item => !!item.checked));
      return data;
    });
  }

  useMemo(() => {
    getChildRowSelectItems(rowSelectItems);
  }, [getChildRowSelectItems, rowSelectItems]);

  const rowSelection = useMemo(
    () => ({
      onChange: handleRowSelection
    }),
    []
  );

  function handleActionSubmit(e) {
    if (e.file) {
      dispatch({
        type: `${moduleName}/updateAlarmRealtimeDetails`,
        payload: e
      })
        .then(res => {
          dataUpdatedHandle(res, 'Alarm Rel-time', () => {
            setDialogStatus(false);
            getAlarmRealtimeList();
          });
        })
        .catch(e => {
          if (e && e.message) {
            msg.error(e.message, 'Alarm Real-time');
          }
        });
    } else {
      dispatch({
        type: `${moduleName}/updateAlarmRealtimeDetailsNoFile`,
        payload: e
      })
        .then(res => {
          dataUpdatedHandle(res, 'Alarm Rel-time', () => {
            setDialogStatus(false);
            getAlarmRealtimeList();
          });
        })
        .catch(e => {
          if (e && e.message) {
            msg.error(e.message, 'Alarm Real-time');
          }
        });
    }
  }

  function handleDownload() {
    dispatch({
      type: `${moduleName}/alarmRealtimeDownload`,
      payload: actionData.alarmDetailsUuid
    });
  }

  const handleSortChange = useCallback(
    data => {
      getAlarmRealtimeList(data.sort);
    },
    [getAlarmRealtimeList]
  );

  function handlePreviewClose() {
    setViewDataStatus(false);
  }
  return (
    <>
      {viewDataStatus && (
        <AlarmItemView
          title={I18n.t('alarm.history.alarmDetails')}
          dataSource={handleViewDataForShowing(actionData)}
          invokeDownload={handleDownload}
          open={viewDataStatus}
          handleClose={handlePreviewClose}
        />
      )}
      <Download exportData={alarmRealtimeExportData} />

      <AlarmHistoryAction
        componentTarget="alarmRealtime"
        dataSource={rowSelectItems}
        userId={userId}
        open={rowSelectItems.length === 1}
        getActionData={handleActions}
      />
      <IVHTable
        rowSelection={rowSelection}
        keyId="alarmDetailsUuid"
        columns={columns}
        dataSource={dataSource}
        handleSortChange={handleSortChange}
        tableMaxHeight={rowSelectItems.length === 1 ? 'calc(100% - 92px)' : 'calc(100% - 56px)'}
      />
      <Pagination
        page={pageNo}
        rowsPerPage={pageSize}
        count={alarmRealtimeData.length || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
      {dialogStatus && (
        <AlarmHistoryDialog
          open={dialogStatus}
          handleClose={handleDialogClose}
          dataSource={actionData}
          actionData={handleActionData(alarmRealtimeActionData)}
          actionType={actionType}
          handleSubmit={handleActionSubmit}
          userId={userId}
          onDownload={handleDownload}
        />
      )}
      <FormatJSONShow />
    </>
  );
}

export default connect(({ global, alarmRealtime }) => ({
  global,
  alarmRealtime
}))(AlarmHistory);
