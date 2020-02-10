/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import {
  VapDialog,
  LiveVaInstanceDetailsBox,
  JobVaInstanceConfigBox,
  LiveVaInstanceSourceBox,
  LiveVaInstanceVideoBox,
  InstanceScheduleBox
} from 'components/UVAP';
import { I18n } from 'react-i18nify';
import { connect } from 'dva';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { VAP_COMMON } from 'commons/constants/commonConstant';

// import Stepper from '@material-ui/core/Stepper';
// import Step from '@material-ui/core/Step';
// import StepLabel from '@material-ui/core/StepLabel';
import Collapse from '@material-ui/core/Collapse';
import {
  handleGetSourceList,
  handleGetArgumentsList,
  handleInitRecordingList,
  handleGetAvailableOptions,
  handleEnginesList
} from '../util';

const useStyles = makeStyles(theme => {
  return {
    dialog: {
      width: '96%',
      maxWidth: '96%',
      overflow: 'hidden'
    },
    margin: {
      marginTop: theme.spacing(2)
    },
    dialogContainer: {
      height: 'calc(100% - 47px)',
      width: '100%',
      display: 'flex',
      borderRadius: '4px',
      marginTop: '6px'
    },
    dialogContent: {
      display: 'flex'
    },
    leftContent: {
      width: '40%',
      padding: '0px',
      marginRight: '6px',
      overflowY: 'auto'
    },
    rightContent: {
      width: '60%',
      display: 'flex',
      flexDirection: 'column'
    }
  };
});

const instanceInfoAction = (info, action) => {
  switch (action.type) {
    case '':
      return action.data;
    case 'name':
      return { ...info, name: action.data };
    // case 'priority':
    //   return { ...info, priority: action.data };
    case 'appId':
      return { ...info, appId: action.data };
    default:
      throw new Error();
  }
};
const sourceDetailsAction = (info, action) => {
  switch (action.type) {
    case '':
      return action.data;
    case 'provider':
      return { ...info, provider: action.data };
    case 'deviceProviderId':
      return { ...info, deviceProviderId: action.data };
    // case 'deviceChannelId':
    //   return { ...info, deviceChannelId: action.data };
    // case 'deviceId':
    //   return { ...info, deviceId: action.data };
    case 'url':
      return { ...info, url: action.data };
    case 'fileId':
      return { ...info, fileId: action.data };
    default:
      console.log(action);
  }
};
const argumentAction = (info, action) => {
  switch (action.type) {
    case '':
      return { ...action.data };
    case 'from':
      return { ...info, from: action.data };
    case 'to':
      return { ...info, to: action.data };
    case 'live':
      return { ...info, live: action.data };
    case 'stream-type':
      return { ...info, 'stream-type': action.data };
    case 'null':
      return {};
    default:
      throw new Error();
  }
};

const channelPageAction = (pageInfo, action) => {
  switch (action.type) {
    case 'pageNo':
      return { ...pageInfo, pageNo: action.data };
    case 'pageSize':
      return { pageNo: PAGE_NUMBER, pageSize: action.data };
    default:
      throw new Error();
  }
};
const filePageAction = (pageInfo, action) => {
  switch (action.type) {
    case 'pindex':
      return { ...pageInfo, pindex: action.data };
    case 'psize':
      return { pindex: PAGE_NUMBER, psize: action.data };
    default:
      throw new Error();
  }
};

const scheduleAction = (info, action) => {
  switch (action.type) {
    case '':
      return action.data || {};
    case 'name':
      return { ...info, name: action.data };
    case 'timeZone':
      return { ...info, timeZone: action.data };
    case 'weeklyPeriods':
      return { ...info, weeklyPeriods: action.data };
    default:
      return {};
  }
};

function LiveVaInstanceEditDialog(props) {
  const validate = useRef(null);
  const classes = useStyles();
  const {
    dispatch,
    global,
    LiveVaInstance,
    onClose,
    open,
    getEngineList,
    createNewInstance,
    updateInstance,
    editDialogType
  } = props;
  const { userId } = global;
  const {
    instanceDetails,
    namespace,
    engineList,
    vaGateway,
    channelList,
    fileList,
    recordingData,
    frsGroups,
    engineStatusList
  } = LiveVaInstance;
  const moduleName = namespace;
  const dialogTitle =
    editDialogType === 'create'
      ? I18n.t('vap.dialog.instance.live.createTitle')
      : I18n.t('vap.dialog.instance.live.updateTitle');
  // eslint-disable-next-line no-unused-vars
  const [oldData, setOldData] = useState({});
  const [instanceInfo, dispatchInstanceInfo] = useReducer(instanceInfoAction, {});
  const [parameters, setParameters] = useState([]);
  const [sourceDetails, dispatchSourceDetails] = useReducer(sourceDetailsAction, {});
  const [multipleDeivceItems, setMultipleDeivceItems] = useState([]);
  const [schedule, dispatchSchedule] = useReducer(scheduleAction, {});
  const [argument, dispatchArgument] = useReducer(argumentAction, {});
  // source provider list init
  const [sourceList, setSourceList] = useState([]);
  // available options init
  const [availableOptions, setAvailableOptions] = useState([]);
  // arguments list init
  const [argumentsList, setArgumentsList] = useState([]);
  // channel table init
  const [channelPage, dispatchChannelPage] = useReducer(channelPageAction, {
    pageNo: PAGE_NUMBER,
    pageSize: PAGE_SIZE
  });

  // files table init
  const [filePage, dispatchFilePage] = useReducer(filePageAction, {
    pindex: PAGE_NUMBER,
    psize: PAGE_SIZE
  });
  // stream Data
  const [channelNode, setChannelNode] = useState({});

  // recording list init
  const [recordingList, setRecordingList] = useState([]);

  const resetInstanceDetailsState = useCallback(() => {
    dispatch({
      type: `${moduleName}/resetInstanceDetailsState`
    });
  }, [dispatch, moduleName]);

  useEffect(() => {
    return () => {
      resetInstanceDetailsState();
    };
  }, [resetInstanceDetailsState]);

  useEffect(() => {
    setOldData(instanceDetails || {});
    dispatchInstanceInfo({ type: '', data: editDialogType === 'create' ? {} : instanceDetails });
    if (!_.isEmpty(instanceDetails)) {
      setParameters(editDialogType === 'create' ? [] : instanceDetails.parameters || []);
      dispatchSourceDetails({
        type: '',
        data: editDialogType === 'create' ? {} : instanceDetails.sourceDetails || {}
      });
      dispatchArgument({
        type: '',
        data: editDialogType === 'create' ? {} : instanceDetails.sourceDetails.arguments || {}
      });
    }
    dispatchSchedule({
      type: '',
      data: editDialogType === 'create' ? {} : instanceDetails.schedule
    });
  }, [instanceDetails, editDialogType]);

  const [engineData, setEngineData] = useState({});
  useEffect(() => {
    setEngineData(handleEnginesList(engineList));
  }, [engineList]);

  useEffect(() => {
    setRecordingList(handleInitRecordingList(recordingData.recordPeriod || []) || []);
  }, [recordingData]);

  // useEffect(() => {
  //   return () => {
  //     setOldData({});
  //     dispatchInstanceInfo({ type: '', data: {} });
  //     setParameters([]);
  //     dispatchSourceDetails({ type: '', data: {} });
  //     dispatchArgument({ type: '', data: {} });
  //   };
  // }, []);

  useEffect(() => {
    if (_.isEmpty(schedule.weeklyPeriods)) {
      dispatchSchedule({ type: 'timeZone', data: '' });
      dispatchSchedule({ type: 'name', data: '' });
    }
  }, [schedule.weeklyPeriods]);

  // validate init
  const validationAction = (info, action) => {
    const newInfo = _.cloneDeep(info);
    newInfo[action.type] = action.data;
    validate.current = newInfo;
    switch (action.type) {
      case 'name':
        return { ...info, name: action.data };
      case 'appId':
        return { ...info, appId: action.data };
      // case 'priority':
      //   return { ...info, priority: action.data };
      case 'deviceChannelId':
        return { ...info, deviceChannelId: action.data };
      case 'provider':
        return { ...info, provider: action.data };
      case 'streamType':
        return { ...info, streamType: action.data };
      case 'url':
        return { ...info, url: action.data };
      case 'fileId':
        return { ...info, fileId: action.data };
      case 'scheduleName':
        return { ...info, scheduleName: action.data };
      case 'timeZone':
        return { ...info, timeZone: action.data };
      default:
        throw new Error();
    }
  };
  const [validation, dispatchValidation] = useReducer(validationAction, {
    appId: false,
    name: false
    // priority: false
  });

  // validate effect
  useEffect(() => {
    instanceInfoValidation(instanceInfo);
  }, [instanceInfo]);
  useEffect(() => {
    sourceDetailsValidation(sourceDetails, argument, multipleDeivceItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceDetails, argument, multipleDeivceItems]);
  useEffect(() => {
    scheduleValidation(schedule);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule.timeZone, schedule.name]);
  useEffect(() => {
    validate.current = _.cloneDeep(validation);
  }, [validation]);
  // validate instanceInfo
  function instanceInfoValidation(instanceInfo) {
    if (instanceInfo.name === '') {
      dispatchValidation({ type: 'name', data: true });
    } else {
      dispatchValidation({ type: 'name', data: false });
    }
    if (instanceInfo.appId === '') {
      dispatchValidation({ type: 'appId', data: true });
    } else {
      dispatchValidation({ type: 'appId', data: false });
    }
    // if (instanceInfo.priority === '') {
    //   dispatchValidation({ type: 'priority', data: true });
    // } else {
    //   dispatchValidation({ type: 'priority', data: false });
    // }
  }
  function scheduleValidation(schedule) {
    if (
      !_.isNil(schedule) &&
      !_.isEmpty(schedule) &&
      !_.isNil(schedule.weeklyPeriods) &&
      !_.isEmpty(schedule.weeklyPeriods)
    ) {
      if (_.isNil(schedule.name) || schedule.name === '') {
        dispatchValidation({ type: 'scheduleName', data: true });
      } else {
        dispatchValidation({ type: 'scheduleName', data: false });
      }
      if (_.isNil(schedule.timeZone) || schedule.timeZone === '') {
        dispatchValidation({ type: 'timeZone', data: true });
      } else {
        dispatchValidation({ type: 'timeZone', data: false });
      }
    }
  }
  function sourceDetailsValidation(sourceDetails, argument, multipleDeivceItems) {
    if (sourceDetails.provider === '') {
      dispatchValidation({ type: 'provider', data: true });
    } else {
      dispatchValidation({ type: 'provider', data: false });
    }
    if (sourceDetails.provider === 'vap_device_stream') {
      if (editDialogType === 'create') {
        if (_.isEmpty(multipleDeivceItems)) {
          dispatchValidation({ type: 'deviceChannelId', data: true });
        } else {
          dispatchValidation({ type: 'deviceChannelId', data: false });
        }
      } else if (editDialogType === 'update') {
        if (_.isNil(sourceDetails.deviceChannelId) || sourceDetails.deviceChannelId === '') {
          dispatchValidation({ type: 'deviceChannelId', data: true });
        } else {
          dispatchValidation({ type: 'deviceChannelId', data: false });
        }
      }
      if (argument['type-stream'] === '') {
        dispatchValidation({ type: 'streamType', data: true });
      } else {
        dispatchValidation({ type: 'streamType', data: false });
      }
    } else if (sourceDetails.provider === 'url') {
      if (sourceDetails.url === '') {
        dispatchValidation({ type: 'url', data: true });
      } else {
        dispatchValidation({ type: 'url', data: false });
      }
    } else if (sourceDetails.provider === 'vap_storage_file') {
      if (sourceDetails.fileId === '') {
        dispatchValidation({ type: 'fileId', data: true });
      } else {
        dispatchValidation({ type: 'fileId', data: false });
      }
    }
  }
  function saveInstanceInfoValidation(
    instanceInfo,
    sourceDetails,
    argument,
    schedule,
    multipleDeivceItems
  ) {
    let isValidateOk = true;
    if (_.isNil(instanceInfo.name) || instanceInfo.name === '') {
      dispatchValidation({ type: 'name', data: true });
      isValidateOk = false;
    } else {
      dispatchValidation({ type: 'name', data: false });
    }
    if (_.isNil(instanceInfo.appId) || instanceInfo.appId === '') {
      dispatchValidation({ type: 'appId', data: true });
      isValidateOk = false;
    } else {
      dispatchValidation({ type: 'appId', data: false });
    }
    if (_.isNil(sourceDetails.provider) || sourceDetails.provider === '') {
      dispatchValidation({ type: 'provider', data: true });
      isValidateOk = false;
    } else {
      dispatchValidation({ type: 'provider', data: false });
    }
    if (sourceDetails.provider === 'vap_device_stream') {
      if (editDialogType === 'create') {
        if (_.isEmpty(multipleDeivceItems)) {
          isValidateOk = false;
          dispatchValidation({ type: 'deviceChannelId', data: true });
        } else {
          dispatchValidation({ type: 'deviceChannelId', data: false });
        }
      } else if (editDialogType === 'update') {
        if (_.isNil(sourceDetails.deviceChannelId) || sourceDetails.deviceChannelId === '') {
          isValidateOk = false;
          dispatchValidation({ type: 'deviceChannelId', data: true });
        } else {
          dispatchValidation({ type: 'deviceChannelId', data: false });
        }
      }

      if (_.isNil(argument['stream-type']) || argument['stream-type'] === '') {
        isValidateOk = false;
        dispatchValidation({ type: 'streamType', data: true });
      } else {
        dispatchValidation({ type: 'streamType', data: false });
      }
    } else if (sourceDetails.provider === 'url') {
      if (_.isNil(sourceDetails.url) || sourceDetails.url === '') {
        dispatchValidation({ type: 'url', data: true });
        isValidateOk = false;
      } else {
        dispatchValidation({ type: 'url', data: false });
      }
    } else if (sourceDetails.provider === 'vap_storage_file') {
      if (_.isNil(sourceDetails.fileId) || sourceDetails.fileId === '') {
        isValidateOk = false;
        dispatchValidation({ type: 'fileId', data: true });
      } else {
        dispatchValidation({ type: 'fileId', data: false });
      }
    }
    if (
      !_.isNil(schedule) &&
      !_.isEmpty(schedule) &&
      !_.isNil(schedule.weeklyPeriods) &&
      !_.isEmpty(schedule.weeklyPeriods)
    ) {
      if (_.isNil(schedule.name) || schedule.name === '') {
        isValidateOk = false;
        dispatchValidation({ type: 'scheduleName', data: true });
      } else {
        dispatchValidation({ type: 'scheduleName', data: false });
      }
      if (_.isNil(schedule.timeZone) || schedule.timeZone === '') {
        isValidateOk = false;
        dispatchValidation({ type: 'timeZone', data: true });
      } else {
        dispatchValidation({ type: 'timeZone', data: false });
      }
    }
    return isValidateOk;
  }
  function handleSave() {
    const newInstance = _.cloneDeep(instanceInfo);
    const newSourceDetails = _.cloneDeep(sourceDetails);
    const newArgument = _.cloneDeep(argument);
    const newParameters = _.cloneDeep(parameters);
    let newSchedule = _.cloneDeep(schedule);
    newSourceDetails.arguments = newArgument;

    newInstance.parameters = newParameters;
    const validateOk = saveInstanceInfoValidation(
      newInstance,
      newSourceDetails,
      newArgument,
      newSchedule,
      multipleDeivceItems
    );

    if (_.isNil(newSchedule.name) || newSchedule.name === '') {
      newSchedule = null;
    }
    newInstance.schedule = newSchedule;

    if (validateOk && editDialogType === 'create') {
      newInstance.sourceDetails = [];
      if (sourceDetails.provider === 'vap_device_stream') {
        multipleDeivceItems.forEach(item => {
          const sourceDetailsItem = {
            deviceChannelId: item.channelId,
            deviceId: item.deviceId,
            ...newSourceDetails
          };
          newInstance.sourceDetails.push(sourceDetailsItem);
        });
      } else if (sourceDetails.provider === 'url') {
        newInstance.sourceDetails.push(newSourceDetails);
      }
      createNewInstance(newInstance);
    } else if (validateOk && editDialogType === 'update') {
      newInstance.sourceDetails = newSourceDetails;
      updateInstance(newInstance);
    }
  }
  function handleClose() {
    onClose();
  }

  const getChannelList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getChannelList`,
        payload: {
          userId,
          ...channelPage,
          ...obj
        }
      });
    },
    [channelPage, dispatch, moduleName, userId]
  );

  const getFileList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getFileList`,
        payload: {
          userId,
          ...filePage,
          ...obj
        }
      });
    },
    [dispatch, filePage, moduleName, userId]
  );

  const getRecordingList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getRecordingList`,
        payload: {
          userId,
          psize: 999,
          channelId: sourceDetails.deviceChannelId,
          deviceId: sourceDetails.deviceId,
          ...obj
        }
      });
    },
    [dispatch, moduleName, sourceDetails.deviceChannelId, sourceDetails.deviceId, userId]
  );

  useEffect(() => {
    // in Job va instance, need to remove the vap_device_stream
    const newSouceList = handleGetSourceList(instanceInfo.appId, vaGateway, engineData.items);
    newSouceList.forEach((item, index) => {
      if (item.provider === VAP_COMMON.provider.file) delete newSouceList[index];
    });
    setSourceList(newSouceList);
    setAvailableOptions(handleGetAvailableOptions(instanceInfo.appId, engineData.items));
    if (editDialogType === 'create') setParameters([]);
    return () => {
      setSourceList([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceInfo.appId, vaGateway, engineData]);
  useEffect(() => {
    setArgumentsList(handleGetArgumentsList(sourceDetails.provider, sourceList));
    setChannelNode({});
  }, [sourceDetails.provider, sourceList]);

  useEffect(() => {
    if (sourceDetails.provider === 'vap_device_stream') {
      if (editDialogType === 'update') {
        getChannelList({ channelId: sourceDetails.deviceChannelId });
        // getChannelList();
      } else {
        getChannelList();
      }
    }
  }, [editDialogType, getChannelList, sourceDetails.deviceChannelId, sourceDetails.provider]);
  useEffect(() => {
    if (sourceDetails.provider === 'vap_storage_file') getFileList();
  }, [getFileList, sourceDetails.provider]);
  useEffect(() => {
    if (sourceDetails.provider !== 'vap_device_stream') dispatchArgument({ type: 'null' });
  }, [sourceDetails.provider]);

  useEffect(() => {
    if (!_.isNil(sourceDetails.deviceChannelId) && sourceDetails.deviceChannelId !== '')
      getRecordingList();
  }, [getRecordingList, sourceDetails.deviceChannelId]);

  // getFrsGroups
  const getFrsGroups = useCallback(() => {
    dispatch({
      type: `${moduleName}/getFrsGroups`,
      payload: {
        appId: instanceInfo.appId
      }
    });
  }, [dispatch, instanceInfo.appId, moduleName]);
  return (
    <VapDialog
      open={open}
      title={dialogTitle}
      handleSave={handleSave}
      handleClose={handleClose}
      dialogWidth={classes.dialog}
      dialogContent={classes.dialogContent}
      ref={validate}
    >
      <div className={classes.leftContent}>
        {/* <Stepper activeStep={0}>
          <Step key={1} {...stepProps}>
            <StepLabel {...labelProps}>{label}</StepLabel>
          </Step>
        </Stepper> */}
        <LiveVaInstanceDetailsBox
          instanceInfo={instanceInfo}
          dispatchInstanceInfo={dispatchInstanceInfo}
          dispatchSourceDetails={dispatchSourceDetails}
          dispatchArgument={dispatchArgument}
          getEngineList={getEngineList}
          engineList={engineData}
          editDialogType={editDialogType}
          validation={validation}
          engineStatusList={engineStatusList}
        />
        <LiveVaInstanceSourceBox
          sourceDetails={sourceDetails}
          sourceList={sourceList}
          dispatchSourceDetails={dispatchSourceDetails}
          dispatchArgument={dispatchArgument}
          argument={argument}
          argumentsList={argumentsList}
          dispatchChannelPage={dispatchChannelPage}
          channelPage={channelPage}
          channelList={channelList}
          editDialogType={editDialogType}
          setChannelNode={setChannelNode}
          validation={validation}
          multipleDeivceItems={multipleDeivceItems}
          setMultipleDeivceItems={setMultipleDeivceItems}
        />
        <InstanceScheduleBox
          schedule={schedule}
          validation={validation}
          dispatchSchedule={dispatchSchedule}
        />
        <Collapse in={!_.isEmpty(availableOptions)} timeout="auto">
          <JobVaInstanceConfigBox
            parameters={parameters}
            availableOptions={availableOptions}
            setParameters={setParameters}
            global={global}
            frsGroups={frsGroups}
            getFrsGroups={getFrsGroups}
            currentAppInfo={instanceInfo}
          />
        </Collapse>
      </div>
      <div className={classes.rightContent}>
        <LiveVaInstanceVideoBox
          sourceDetails={sourceDetails}
          argument={argument}
          channelNode={channelNode}
          parameters={parameters}
          setParameters={setParameters}
          availableOptions={availableOptions}
        />
      </div>
    </VapDialog>
  );
}

LiveVaInstanceEditDialog.defaultProps = {
  onClose: () => {},
  open: false,
  getEngineList: () => {},
  createNewInstance: () => {},
  updateInstance: () => {},
  editDialogType: ''
};

LiveVaInstanceEditDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  getEngineList: PropTypes.func,
  createNewInstance: PropTypes.func,
  updateInstance: PropTypes.func,
  editDialogType: PropTypes.string
};

export default connect(({ global, LiveVaInstance }) => ({
  global,
  LiveVaInstance
}))(LiveVaInstanceEditDialog);
