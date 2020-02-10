import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { makeStyles } from '@material-ui/core/styles';
import { SingleSelect, TextField, isPermissionHas } from 'components/common';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import materialKeys from 'utils/materialKeys';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import msg from 'utils/messageCenter';
// import store from '@/index';
import {
  getAlarmInfo,
  getAlarmSelectOptions,
  getAlarmRequestData,
  handleEventTypes,
  isTheModelIdChange
} from './utils';
import AlarmConfigEventTypes from './AlarmConfigEventTypes';
import AlarmDialog from '../AlarmDialog';
import styles from './AlarmConfigAddOrUpdateInfo.module.less';

const useStyles = makeStyles(() => ({
  dialog: {
    width: '960px',
    maxWidth: '960px',
    maxHeight: 'calc(100% - 300px)'
  },
  alarm_name: {
    margin: 0
  },
  vms_search: {
    flex: 1
  }
}));

function AlarmConfigAddOrUpdateInfo(props) {
  const {
    alarmData,
    alarmConfig,
    open,
    closeDialog,
    tableDataSource,
    modelOptions,
    onSave,
    title,
    dispatch,
    global,
    cameraPageShow
  } = props;
  const { userId } = global;
  const classes = useStyles();
  const [alarmName, setAlarmName] = useState('');
  const [eventType, setEventType] = useState('');
  const [isEventTypesHandleShow, setIsEventTypesHandleShow] = useState(false);
  const [alarmSeverity, setAlarmSeverity] = useState('');
  const [alarmStatus, setAlarmStatus] = useState('');
  const [selectedItems, setSelectedItems] = useState('');
  const [alarmNameErrorStatus, setAlarmNameErrorStatus] = useState(false);
  const [alarmSeverityErrorStatus, setAlarmSeverityErrorStatus] = useState(false);
  const [alarmStatusErrorStatus, setAlarmStatusErrorStatus] = useState(false);
  const [eventTypeErrorStatus, setEventTypeErrorStatus] = useState(false);

  const isAdd = _.isEmpty(alarmData);

  useEffect(() => {
    if (!_.isEmpty(alarmConfig) && !isAdd) {
      const defaultEventTypes = getAlarmInfo(alarmConfig, alarmData.eventType, 'eventType');
      setEventType(defaultEventTypes);
      setIsEventTypesHandleShow(!!handleEventTypes(defaultEventTypes).length);
      setAlarmSeverity(getAlarmInfo(alarmConfig, alarmData.alarmSeverity, 'alarmSeverity'));
      setAlarmStatus(alarmData.alarmStatus || '');
      setSelectedItems(alarmData.sourceId || '');
      setAlarmName(alarmData.alarmName || '');
    }
  }, [alarmData, alarmConfig, isAdd]);

  useEffect(() => {
    setIsEventTypesHandleShow(cameraPageShow);
  }, [cameraPageShow]);

  function handleAlarmName(e) {
    const { value } = e.target;
    setAlarmNameErrorStatus(!value.trim());
    setAlarmName(value);
  }

  const getChannelsList = useCallback(
    (obj = {}) => {
      dispatch({
        type: 'alarmConfiguration/getChannelsData',
        payload: {
          userId,
          // key: '',
          // Model: '',
          pageNo: PAGE_NUMBER,
          pageSize: PAGE_SIZE,
          ...obj
        }
      });
    },
    [dispatch, userId]
  );
  function checkOpenCameraPage(e) {
    // console.log('checkOpenCameraPage', isEventTypesHandleShow);
    if (handleEventTypes(e).length) {
      // console.log('checkOpenCameraPage panduan', isEventTypesHandleShow);
      getChannelsList();
    }
  }
  function handleEventType(e) {
    setEventTypeErrorStatus(!e.length);
    setEventType(e);
    setIsEventTypesHandleShow(!!handleEventTypes(e).length);
    checkOpenCameraPage(e);
  }

  function handleAlarmSeverity(e) {
    setAlarmSeverity(e);
    setAlarmSeverityErrorStatus(false);
  }

  function handleAlarmStatus(e) {
    setAlarmStatus(e);
    setAlarmStatusErrorStatus(false);
  }

  function handleClose() {
    closeDialog(false);
  }

  function handleSave() {
    if (!alarmName.trim()) {
      setAlarmNameErrorStatus(true);
    }
    if (!alarmSeverity) {
      setAlarmSeverityErrorStatus(true);
    }
    if (!alarmStatus) {
      setAlarmStatusErrorStatus(true);
    }
    if (!eventType.length) {
      setEventTypeErrorStatus(true);
    }
    const eventTypeForReq = getAlarmRequestData(alarmConfig, 'eventType', eventType);
    const alarmSeverityForReq = getAlarmRequestData(alarmConfig, 'alarmSeverity', alarmSeverity);
    const selectedChannelIds = selectedItems || '';
    if (isAdd) {
      if (!alarmName.trim() || !alarmSeverity || !alarmStatus || !eventType.length) {
        return;
      }
      onSave({
        alarmName,
        alarmSeverity: alarmSeverityForReq,
        alarmStatus,
        eventType: eventTypeForReq,
        sourceId: selectedChannelIds
      });
    } else {
      const isAlarmNameSame = alarmName === alarmData.alarmName;
      const isEventTypeSame = eventType[0] === alarmData.eventTypeDescription;
      const isAlarmSeveritySame = alarmSeverity === alarmData.alarmSeverityDescription;
      const isAlarmStatusSame = alarmStatus === alarmData.alarmStatus;

      const isIdsChange = isTheModelIdChange(selectedItems, alarmData.sourceId);
      const isNoChange =
        isAlarmNameSame && isEventTypeSame && isAlarmSeveritySame && isAlarmStatusSame;
      if (
        (!isEventTypesHandleShow && isNoChange) ||
        (isEventTypesHandleShow && isNoChange && isIdsChange)
      ) {
        msg.warn(I18n.t('global.popUpMsg.noChange'), 'Update Alarm');
        return;
      }
      onSave({
        alarmDefinitionUuid: alarmData.alarmDefinitionUuid,
        alarmName,
        eventType: eventTypeForReq,
        alarmSeverity: alarmSeverityForReq,
        alarmStatus,
        sourceId: selectedChannelIds
      });
    }
  }

  function getSelectedItems(e) {
    setSelectedItems(e);
  }
  return (
    <AlarmDialog
      open={open}
      title={title}
      handleSave={handleSave}
      handleClose={handleClose}
      isActionNeeded={isPermissionHas(materialKeys['M4-25'])}
    >
      <div className={styles.action_wrapper}>
        <TextField
          className={classes.alarm_name}
          label={`${I18n.t('alarm.config.alarmName')}*`}
          placeholder={I18n.t('alarm.config.inputAlarmName')}
          fullWidth
          onChange={handleAlarmName}
          value={alarmName}
          margin="normal"
          helperText={alarmNameErrorStatus ? VALIDMSG_NOTNULL : ''}
          error={alarmNameErrorStatus}
        />
        <SingleSelect
          label={`${I18n.t('alarm.config.alarmSeverity')}*`}
          onSelect={handleAlarmSeverity}
          selectOptions={getAlarmSelectOptions(alarmConfig.alarmSeverity)}
          value={alarmSeverity}
          error={alarmSeverityErrorStatus}
          errorMessage={VALIDMSG_NOTNULL}
        />
        <SingleSelect
          label={`${I18n.t('alarm.config.status')}*`}
          onSelect={handleAlarmStatus}
          selectOptions={[I18n.t('alarm.config.enabled'), I18n.t('alarm.config.disabled')]}
          value={alarmStatus}
          error={alarmStatusErrorStatus}
          errorMessage={VALIDMSG_NOTNULL}
        />
      </div>
      <SingleSelect
        label={`${I18n.t('alarm.config.eventType')}*`}
        onSelect={handleEventType}
        disabled={!_.isEmpty(alarmData)}
        selectOptions={getAlarmSelectOptions(alarmConfig.eventType)}
        value={eventType}
        error={eventTypeErrorStatus}
        errorMessage={VALIDMSG_NOTNULL}
        className={styles.event_type}
      />
      {isEventTypesHandleShow && (
        <AlarmConfigEventTypes
          eventTypes={eventType}
          tableDataSource={tableDataSource}
          modelOptions={modelOptions}
          getSelectedItems={getSelectedItems}
          alarmData={alarmData}
        />
      )}
    </AlarmDialog>
  );
}

AlarmConfigAddOrUpdateInfo.defaultProps = {
  alarmData: {},
  tableDataSource: {},
  modelOptions: [],
  title: ''
};

AlarmConfigAddOrUpdateInfo.propTypes = {
  alarmData: PropTypes.object,
  tableDataSource: PropTypes.any,
  modelOptions: PropTypes.array,
  title: PropTypes.string
};

export default connect(({ global, alarmConfiguration }) => ({
  global,
  alarmConfiguration
}))(AlarmConfigAddOrUpdateInfo);
