import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { I18n } from 'react-i18nify';
import CardMedia from '@material-ui/core/CardMedia';
import { connect } from 'dva';
import {
  SpecialWatchListSearchControl,
  ViewEnrolledPersonsBySpecialWatch,
  getRequestImageType,
  getUserIdFromSuccessData,
  NoSpecialWatchList
} from 'components/UVAP/Face';
import { IVHTable, Pagination, PreviewImage, Download, ConfirmPage } from 'components/common';
import { getSeverityClassName, addBase64Prefix, handlePaginationFront } from 'utils/utils';
import moment from 'moment';
import {
  PoiOrAoiAlarmAction,
  handleCheckedItem,
  ActionForAlarmRealTimeVap,
  VapAlarmShowDetails
} from 'components/Alarm';
import { dataUpdatedHandle } from 'utils/helpers';
import msg from 'utils/messageCenter';
import { DATE_FORMAT, PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { handleActionData, handleVapAlarmSourceData } from '../../../Alarm/AlarmRealtime/utils';
import { getGroupId } from './utils';

function SpecialWatchList(props) {
  const moduleName = 'specialWatchList';
  const {
    dispatch,
    global: { userId },
    specialWatchList
  } = props;
  const {
    alarmRealtimeVapExportData = null,
    realTimeAlarmForVAP,
    alarmInitInfo,
    alarmRealtimeVapActionData,
    streamData,
    playbackStreamData,
    groupsData,
    personsList
  } = specialWatchList;
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [pageSizePerson, setPageSizePerson] = useState(PAGE_SIZE);
  const [pageNoPerson, setPageNoPerson] = useState(PAGE_NUMBER);
  const [alarmVapSourceData, setAlarmVapSourceData] = useState([]);
  const [previewStatus, setPreviewStatus] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [rowSelectItems, setRowSelectItems] = useState([]);
  const [dialogStatus, setDialogStatus] = useState(false);
  const [actionData, setActionData] = useState({});
  const [alarmDetailsStatus, setAlarmDetailsStatus] = useState(false);
  const [alarmDetailsData, setAlarmDetailsData] = useState({});
  const [specialWatchStatus, setSpecialWatchStatus] = useState(false);
  const [falsePositiveStatus, setFalsePositiveStatus] = useState(false);

  const startWatchRef = useRef(null);
  const specialListComponent = useRef(null);

  const theSpecialGroupId = getGroupId(groupsData);

  useEffect(() => {
    return () => {
      dispatch({
        type: `${moduleName}/clear`
      });
    };
  }, [dispatch]);

  const getRealTimeAlarmForVAP = useCallback(() => {
    if (!theSpecialGroupId) return;
    dispatch({
      type: `${moduleName}/getRealTimeAlarmForVAP`,
      payload: {
        userId,
        sort: [{ key: 'time', sort: 'desc' }],
        vapFrsGroupId: theSpecialGroupId
      }
    });
  }, [dispatch, theSpecialGroupId, userId]);

  const getPersonsListData = useCallback(() => {
    dispatch({
      type: `${moduleName}/vapFrsGetPersons`,
      payload: {
        groupId: theSpecialGroupId,
        pindex: pageNoPerson,
        psize: pageSizePerson
      }
    });
  }, [dispatch, theSpecialGroupId, pageNoPerson, pageSizePerson]);

  useEffect(() => {
    if (specialWatchStatus) {
      getPersonsListData();
    }
  }, [specialWatchStatus, getPersonsListData]);

  // initial alarm system config
  useEffect(() => {
    dispatch({
      type: `${moduleName}/getFrsGroups`
    });
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
  }, [alarmInitInfo, pageNo, pageSize, realTimeAlarmForVAP, theSpecialGroupId]);

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
        noTooltip: true
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
        width: 100
      },
      {
        title: I18n.t('alarm.history.alarmTime'),
        dataIndex: 'time',
        render: text => <span>{moment(text).format(DATE_FORMAT)}</span>,
        width: 100,
        noTooltip: true
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
        dataUpdatedHandle(res, 'Special Watch List', () => {
          getRealTimeAlarmForVAP();
        });
      })
      .catch(e => {
        if (e && e.message) {
          msg.error(e.message, 'Special Watch List');
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
          dataUpdatedHandle(res, 'Special Watch List', () => {
            setDialogStatus(false);
            getRealTimeAlarmForVAP();
          });
        })
        .catch(e => {
          if (e && e.message) {
            msg.error(e.message, 'Special Watch List');
          }
        });
    } else {
      delete e.file;
      dispatch({
        type: `${moduleName}/updateAlarmRealtimeDetailsNoFile`,
        payload: e
      })
        .then(res => {
          dataUpdatedHandle(res, 'Special Watch List', () => {
            setDialogStatus(false);
            getRealTimeAlarmForVAP();
          });
        })
        .catch(e => {
          if (e && e.message) {
            msg.error(e.message, 'Special Watch List');
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

  const get = e => {
    startWatchRef.current = e;
  };

  function getSearchControlData(e) {
    switch (e.target) {
      case 'startWatch':
        dispatch({
          type: `${moduleName}/vapFrsAddPerson`,
          payload: {
            confidenceThreshold: e.score,
            userId,
            info: {
              avatar: getRequestImageType(e.uploadImage),
              fullName: 'unknown',
              identityNo: `unknown-${Date.now()}`
            }
          }
        }).then(res => {
          dataUpdatedHandle(res, 'Face Enrolled', () => {
            const userIdForReq = getUserIdFromSuccessData(res);
            if (!userIdForReq) return;
            startWatchRef.current();
            dispatch({
              type: `${moduleName}/vapFrsUpdatePersonImages`,
              payload: {
                userId: userIdForReq,
                imageInfo: {
                  imgBase64: getRequestImageType(e.uploadImage),
                  userId
                }
              }
            });
            dispatch({
              type: `${moduleName}/vapFrsUpdatePersonAssignedGroup`,
              payload: {
                userId: userIdForReq,
                groupIDs: [theSpecialGroupId]
              }
            });
          });
        });
        break;
      case 'viewSpecialWatchList':
        setSpecialWatchStatus(true);
        break;
      default:
        break;
    }
  }

  function onChangeRowsPerPagePerson(e) {
    const { value } = e.target;
    setPageSizePerson(value);
  }

  function onChangePagePerson(e, page) {
    setPageNoPerson(page);
  }

  function onPersonsListClose() {
    setPageNoPerson(PAGE_NUMBER);
    setPageSizePerson(PAGE_SIZE);
    setSpecialWatchStatus(false);
  }

  function handlePersonDelete(e) {
    dispatch({
      type: `${moduleName}/vapFrsDeletePerson`,
      payload: e.id
    })
      .then(res => {
        dataUpdatedHandle(res, I18n.t('vap.face.faceEnrollment.deletePerson'), () => {
          getPersonsListData();
          specialListComponent.current();
        });
      })
      .catch(e => {
        if (e && e.message) {
          msg.error(e.message, I18n.t('vap.face.faceEnrollment.deletePerson'));
        }
      });
  }

  function getSpecialListComponentsMethods(e) {
    specialListComponent.current = e;
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
        dataUpdatedHandle(res, 'Special Watch List', () => {
          getRealTimeAlarmForVAP();
          setFalsePositiveStatus(false);
        });
      })
      .catch(e => {
        if (e && e.message) {
          msg.error(e.message, 'Special Watch List');
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

  return (
    <>
      {!theSpecialGroupId ? (
        <NoSpecialWatchList />
      ) : (
        <>
          <ConfirmPage
            isConfirmPageOpen={falsePositiveStatus}
            message={I18n.t('alarm.remindInformation.falsePositiveMessage')}
            messageTitle={I18n.t('alarm.button.falsePositive')}
            hanldeConfirmMessage={handleFalsePositiveConfirm}
            handleConfirmPageClose={handleFalsePositiveCancel}
          />
          {specialWatchStatus && (
            <ViewEnrolledPersonsBySpecialWatch
              onChangeRowsPerPage={onChangeRowsPerPagePerson}
              onChangePage={onChangePagePerson}
              dataSource={personsList}
              pageSize={pageSizePerson}
              pageNo={pageNoPerson}
              handleClose={onPersonsListClose}
              onDelete={handlePersonDelete}
              get={getSpecialListComponentsMethods}
              open
            />
          )}
          <SpecialWatchListSearchControl get={get} getSearchControlData={getSearchControlData} />
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
            rowSelectionDoubleClick={handleShowAlarmDetails}
            rowSelection={rowSelection}
            keyId="alarmDetailsUuid"
            dataSource={alarmVapSourceData}
            columns={poiOrAoiColumns}
            tableMaxHeight="calc(100% - 158px)"
            handleChooseAll={handleChooseAll}
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
      )}
    </>
  );
}

export default connect(({ specialWatchList, global }) => ({ specialWatchList, global }))(
  SpecialWatchList
);
