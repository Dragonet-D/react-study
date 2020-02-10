import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { I18n } from 'react-i18nify';
import { IVHTable, Pagination, Download, PreviewImage, ConfirmPage } from 'components/common';
import {
  PoiOrAoiAlarmAction,
  handleCheckedItem,
  ActionForAlarmRealTimeVap,
  VapAlarmShowDetails
} from 'components/Alarm';
import { PAGE_NUMBER, PAGE_SIZE, DATE_FORMAT } from 'commons/constants/const';
import { getSeverityClassName, addBase64Prefix, handlePaginationFront } from 'utils/utils';
import CardMedia from '@material-ui/core/CardMedia';
import { dataUpdatedHandle } from 'utils/helpers';
import msg from 'utils/messageCenter';
import { handleActionData, handleVapAlarmSourceData } from './utils';

function AlarmRealtimeVap(props) {
  const moduleName = 'alarmRealtime';
  const {
    dispatch,
    global: { userId, commonWebsocketData },
    alarmRealtime,
    getChildRowSelectItems
  } = props;
  const {
    alarmRealtimeVapExportData,
    realTimeAlarmForVAP,
    alarmInitInfo,
    alarmRealtimeVapActionData,
    streamData,
    playbackStreamData
  } = alarmRealtime;
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [alarmVapSourceData, setAlarmVapSourceData] = useState([]);
  const [previewStatus, setPreviewStatus] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [rowSelectItems, setRowSelectItems] = useState([]);
  const [dialogStatus, setDialogStatus] = useState(false);
  const [actionData, setActionData] = useState({});
  const [alarmDetailsStatus, setAlarmDetailsStatus] = useState(false);
  const [alarmDetailsData, setAlarmDetailsData] = useState({});
  const [timeSort, setTimeSort] = useState('desc');
  const [falsePositiveStatus, setFalsePositiveStatus] = useState(false);
  const setAlarmWSData = useState({})[1];

  useEffect(() => {
    if (!_.isEmpty(commonWebsocketData)) {
      setAlarmWSData(prev => {
        if (!_.isEqual(prev, commonWebsocketData)) {
          if (commonWebsocketData.type === 'VAP_REAL_TIME') {
            const wsDataTemp = _.get(commonWebsocketData, 'data.data', '');
            if (wsDataTemp && _.isArray(wsDataTemp)) {
              setAlarmVapSourceData(prevDataSource => {
                return handleVapAlarmSourceData(
                  [..._.get(commonWebsocketData, 'data.data', []), ...prevDataSource],
                  alarmInitInfo
                );
              });
            }
          }
          return commonWebsocketData;
        }
      });
    }
  }, [alarmInitInfo, commonWebsocketData, setAlarmWSData]);

  const getRealTimeAlarmForVAP = useCallback(() => {
    dispatch({
      type: `${moduleName}/getRealTimeAlarmForVAP`,
      payload: {
        userId,
        sort: [{ key: 'time', sort: timeSort }]
      }
    });
  }, [dispatch, userId, timeSort]);

  // initial alarm system config
  useEffect(() => {
    dispatch({
      type: `${moduleName}/getAlarmInitInfo`
    });
  }, [dispatch, userId]);

  useEffect(() => {
    setAlarmVapSourceData(
      handlePaginationFront(
        handleVapAlarmSourceData(realTimeAlarmForVAP, alarmInitInfo),
        pageSize,
        pageNo
      )
    );
    setRowSelectItems([]);
  }, [alarmInitInfo, pageNo, pageSize, realTimeAlarmForVAP]);

  useEffect(() => {
    getRealTimeAlarmForVAP();
  }, [getRealTimeAlarmForVAP]);

  useEffect(() => {
    return () => {
      dispatch({
        type: `${moduleName}/clearAlarmRealtimeVapActionData`
      });
    };
  }, [dispatch]);

  const handlePreview = useCallback(
    target => () => {
      setPreviewStatus(true);
      setPreviewImage(target);
    },
    []
  );

  const previewClose = () => {
    setPreviewStatus(false);
  };

  const poiOrAoiColumns = useMemo(
    () => [
      {
        title: I18n.t('alarm.history.severity'),
        dataIndex: 'alarmSeverity',
        render: text => <div className={getSeverityClassName(text)}>{text}</div>,
        width: 40,
        noTooltip: true,
        sorter: {
          order: 'desc',
          active: false
        }
      },
      {
        title: I18n.t('alarm.history.enrolled'),
        dataIndex: 'personImages.imgBase64',
        render: text => {
          return (
            <CardMedia
              onClick={handlePreview(addBase64Prefix(text))}
              style={{ height: 40, width: 40 }}
              image={addBase64Prefix(text)}
            />
          );
        },
        width: 40,
        noTooltip: true
      },
      {
        title: I18n.t('alarm.history.matched'),
        dataIndex: 'snapshot',
        render: text => {
          return (
            <>
              {text && (
                <CardMedia
                  onClick={handlePreview(addBase64Prefix(text))}
                  style={{ height: 40, width: 40 }}
                  image={addBase64Prefix(text)}
                />
              )}
            </>
          );
        },
        width: 40,
        noTooltip: true
      },
      {
        title: I18n.t('alarm.history.confidenceLevel'),
        dataIndex: 'data.confidence',
        width: 100,
        sorter: {
          order: 'desc',
          active: false
        }
      },
      {
        title: I18n.t('alarm.history.alarmTime'),
        dataIndex: 'time',
        render: text => <span>{moment(text).format(DATE_FORMAT)}</span>,
        width: 100,
        noTooltip: true,
        sorter: {
          order: 'desc',
          active: true
        }
      },
      {
        title: I18n.t('alarm.history.eventType'),
        dataIndex: 'alarmTypeDesc',
        width: 50
      },
      {
        title: I18n.t('alarm.history.notificationGroup'),
        dataIndex: 'data.personGroupName',
        width: 100
      },
      {
        title: I18n.t('alarm.history.channel'),
        dataIndex: 'data.sourceDeviceChannelName',
        width: 40
      },
      {
        title: I18n.t('alarm.history.status'),
        dataIndex: 'status',
        width: 40
      },
      {
        title: I18n.t('alarm.history.actedBy'),
        dataIndex: 'ownedBy',
        width: 50
      }
    ],
    [handlePreview]
  );

  function onChangePage(e, page) {
    setPageNo(page);
    setAlarmVapSourceData(handlePaginationFront(alarmVapSourceData, pageSize, page));
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    setAlarmVapSourceData(handlePaginationFront(alarmVapSourceData, value, pageNo));
  }

  function handleRowSelection(item) {
    const { alarmDetailsUuid } = item;
    const { checked } = event.target;
    setAlarmVapSourceData(dataSource => {
      const data = handleCheckedItem(dataSource, alarmDetailsUuid, checked, 'alarmDetailsUuid');
      setRowSelectItems(data.filter(item => !!item.checked));
      return data;
    });
  }

  function handleDownload(id) {
    dispatch({
      type: `${moduleName}/alarmRealtimeVapDownload`,
      payload: id
    });
  }

  const rowSelection = useMemo(
    () => ({
      onChange: handleRowSelection
    }),
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
        dataUpdatedHandle(res, 'Alarm Real-time', () => {
          getRealTimeAlarmForVAP();
        });
      })
      .catch(e => {
        if (e && e.message) {
          msg.error(e.message, 'Alarm Real-time');
        }
      });
  }

  const handleActions = (target, data) => {
    switch (target) {
      case 'FalsePositive':
        setFalsePositiveStatus(true);
        break;
      case 'Action':
        setDialogStatus(true);
        setActionData(data);
        dispatch({
          type: `${moduleName}/getAlarmRealtimeVapAction`,
          payload: data.status
        });
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
  };
  function handleDialogClose() {
    setDialogStatus(false);
  }

  function handleActionSubmit(e) {
    if (e.file) {
      dispatch({
        type: `${moduleName}/updateAlarmRealtimeDetails`,
        payload: e
      })
        .then(res => {
          dataUpdatedHandle(res, 'Alarm Rel-time', () => {
            setDialogStatus(false);
            getRealTimeAlarmForVAP();
          });
        })
        .catch(e => {
          if (e && e.message) {
            msg.error(e.message, 'Alarm Real-time');
          }
        });
    } else {
      delete e.file;
      dispatch({
        type: `${moduleName}/updateAlarmRealtimeDetailsNoFile`,
        payload: e
      })
        .then(res => {
          dataUpdatedHandle(res, 'Alarm Rel-time', () => {
            setDialogStatus(false);
            getRealTimeAlarmForVAP();
          });
        })
        .catch(e => {
          if (e && e.message) {
            msg.error(e.message, 'Alarm Real-time');
          }
        });
    }
  }

  function handleShowAlarmDetails(item) {
    setAlarmDetailsData(item);
    setAlarmDetailsStatus(true);
  }

  function handleAlarmDetailsClose() {
    setAlarmDetailsStatus(false);
  }

  function getAlarmDetailsHandleType(type, data) {
    switch (type) {
      case 'live':
        dispatch({
          type: `${moduleName}/getLiveStream`,
          payload: {
            streamId: '0',
            type: 'rtsp/h264',
            ptzInd: 'Y',
            userId,
            channelId: data.channelId,
            channelName: data.channelName,
            deviceId: data.deviceId
          }
        });
        break;
      case 'playback':
        dispatch({
          type: `${moduleName}/getPlaybackStream`,
          payload: {
            streamId: '0',
            type: 'rtsp/h264',
            userId,
            channelId: data.channelId,
            channelName: data.channelName,
            deviceId: data.deviceId,
            from: moment(data.from).format(),
            to: moment(data.to).format()
          }
        });
        break;
      default:
        break;
    }
  }

  function handleSortChange(e) {
    const data = _.get(e, 'data.dataIndex', '');
    const sourceData = _.cloneDeep(realTimeAlarmForVAP);
    if (data === 'alarmSeverity') {
      setAlarmVapSourceData(
        handlePaginationFront(
          _.orderBy(
            handleVapAlarmSourceData(sourceData, alarmInitInfo),
            ['alarmSeverity'],
            [e.sort]
          ),
          pageSize,
          pageNo
        )
      );
    } else if (data === 'data.confidence') {
      setAlarmVapSourceData(
        handlePaginationFront(
          _.orderBy(
            handleVapAlarmSourceData(sourceData, alarmInitInfo),
            ['data.confidence'],
            [e.sort]
          ),
          pageSize,
          pageNo
        )
      );
    } else if (data === 'time') {
      setTimeSort(e.sort);
    }
  }

  function handleFalsePositiveCancel() {
    setFalsePositiveStatus(false);
  }

  function handleFalsePositiveConfirm() {
    dispatch({
      type: `${moduleName}/updateAlarmFalsePositiveStatus`,
      payload: rowSelectItems.map(item => item.alarmDetailsUuid)
    })
      .then(res => {
        dataUpdatedHandle(res, 'Alarm Real-time', () => {
          getRealTimeAlarmForVAP();
          setFalsePositiveStatus(false);
        });
      })
      .catch(e => {
        if (e && e.message) {
          msg.error(e.message, 'Alarm Real-time');
        }
      });
  }

  function handleChooseAll(e) {
    const { checked } = e.target;
    setAlarmVapSourceData(dataSource => {
      const data = dataSource.map(item => ({ ...item, checked }));
      setRowSelectItems(checked ? data : []);
      return data;
    });
  }
  useMemo(() => {
    getChildRowSelectItems(rowSelectItems);
  }, [getChildRowSelectItems, rowSelectItems]);
  return (
    <>
      <ConfirmPage
        isConfirmPageOpen={falsePositiveStatus}
        message={I18n.t('alarm.remindInformation.falsePositiveMessage')}
        messageTitle={I18n.t('alarm.button.falsePositive')}
        hanldeConfirmMessage={handleFalsePositiveConfirm}
        handleConfirmPageClose={handleFalsePositiveCancel}
      />
      {alarmDetailsStatus && (
        <VapAlarmShowDetails
          playbackStreamData={playbackStreamData}
          streamData={streamData}
          getHandleType={getAlarmDetailsHandleType}
          open={alarmDetailsStatus}
          handleClose={handleAlarmDetailsClose}
          dataSource={alarmDetailsData}
        />
      )}
      <PoiOrAoiAlarmAction
        componentTarget="alarmRealtime"
        dataSource={rowSelectItems}
        userId={userId}
        open={rowSelectItems.length > 0}
        getActionData={handleActions}
      />
      {dialogStatus && (
        <ActionForAlarmRealTimeVap
          open
          userId={userId}
          handleClose={handleDialogClose}
          dataSource={actionData}
          actionData={handleActionData(alarmRealtimeVapActionData)}
          onDownload={handleDownload}
          handleSubmit={handleActionSubmit}
        />
      )}
      <Download exportData={alarmRealtimeVapExportData} />
      <IVHTable
        handleChooseAll={handleChooseAll}
        rowSelectionDoubleClick={handleShowAlarmDetails}
        rowSelection={rowSelection}
        keyId="alarmDetailsUuid"
        dataSource={alarmVapSourceData}
        columns={poiOrAoiColumns}
        tableMaxHeight="calc(100% - 56px)"
        handleSortChange={handleSortChange}
      />
      <Pagination
        page={pageNo}
        rowsPerPage={pageSize}
        count={realTimeAlarmForVAP.length || 0}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
      <PreviewImage open={previewStatus} onClose={previewClose} image={previewImage} />
    </>
  );
}

export default connect(({ global, alarmRealtime }) => ({
  global,
  alarmRealtime
}))(AlarmRealtimeVap);
