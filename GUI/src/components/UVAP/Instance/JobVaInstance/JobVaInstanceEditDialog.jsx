import React, { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import {
  VapDialog,
  JobVaInstanceDetailsBox,
  JobVaInstanceConfigBox,
  JobVaInstanceSourceBox,
  JobVaInstanceVideoBox
} from 'components/UVAP';
import { I18n } from 'react-i18nify';
import { connect } from 'dva';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import Collapse from '@material-ui/core/Collapse';
// import { VAP_COMMON } from 'commons/constants/commonConstant';
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
    case 'priority':
      return { ...info, priority: action.data };
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
    case 'deviceChannelId':
      return { ...info, deviceChannelId: action.data };
    case 'deviceId':
      return { ...info, deviceId: action.data };
    case 'url':
      return { ...info, url: action.data };
    case 'fileId':
      return { ...info, fileId: action.data };
    default:
      throw new Error();
  }
};
const argumentAction = (info, action) => {
  switch (action.type) {
    case '':
      return { from: new Date().getTime(), to: new Date().getTime(), ...action.data };
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
    case 'pageNo':
      return { ...pageInfo, pageNo: action.data };
    case 'pageSize':
      return { pageNo: PAGE_NUMBER, pageSize: action.data };
    default:
      throw new Error();
  }
};

function JobVaInstanceEditDialog(props) {
  const validate = useRef(null);
  const classes = useStyles();
  const {
    dispatch,
    global,
    JobVaInstance,
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
    fileNode,
    frsGroups,
    priorityList,
    engineStatusList
  } = JobVaInstance;

  const moduleName = namespace;
  const dialogTitle =
    editDialogType === 'create'
      ? I18n.t('vap.dialog.instance.job.createTitle')
      : I18n.t('vap.dialog.instance.job.updateTitle');
  // eslint-disable-next-line no-unused-vars
  const [oldData, setOldData] = useState({});
  const [instanceInfo, dispatchInstanceInfo] = useReducer(instanceInfoAction, {});
  const [parameters, setParameters] = useState([]);

  const [sourceDetails, dispatchSourceDetails] = useReducer(sourceDetailsAction, {});
  const [argument, dispatchArgument] = useReducer(argumentAction, {
    from: new Date().getTime(),
    to: new Date().getTime()
  });

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
    pageNo: PAGE_NUMBER,
    pageSize: PAGE_SIZE
  });

  // stream Data
  const [channelNode, setChannelNode] = useState({});

  // recording list init
  const [recordingList, setRecordingList] = useState([]);

  useEffect(() => {
    setChannelNode({ ...fileNode, provider: sourceDetails.provider });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileNode]);

  useEffect(() => {
    setChannelNode({
      name: sourceDetails.url,
      url: sourceDetails.url,
      provider: sourceDetails.provider
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceDetails.url]);

  const getFileBlob = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getFileBlob`,
        payload: {
          userId,
          id: sourceDetails.fileId,
          ...obj
        }
      });
    },
    [dispatch, moduleName, sourceDetails.fileId, userId]
  );

  useEffect(() => {
    if (!_.isNil(sourceDetails.fileId) && sourceDetails.fileId !== '') getFileBlob();
  }, [getFileBlob, sourceDetails.fileId]);

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
  }, [instanceDetails, editDialogType]);

  const [engineData, setEngineData] = useState({});
  useEffect(() => {
    setEngineData(handleEnginesList(engineList));
  }, [engineList]);
  useEffect(() => {
    // in Job va instance, need to remove the URL
    // const newSouceList = handleGetSourceList(instanceInfo.appId, vaGateway, engineData.items);
    // newSouceList.forEach((item, index) => {
    //   if (item.provider === VAP_COMMON.provider.url) delete newSouceList[index];
    // });
    // setSourceList(newSouceList);
    setSourceList(handleGetSourceList(instanceInfo.appId, vaGateway, engineData.items));
    setAvailableOptions(handleGetAvailableOptions(instanceInfo.appId, engineData.items));
    if (editDialogType === 'create') setParameters([]);
    return () => {
      setSourceList([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceInfo.appId, vaGateway, engineData]);

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
      case 'priority':
        return { ...info, priority: action.data };
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
      default:
        throw new Error();
    }
  };
  const [validation, dispatchValidation] = useReducer(validationAction, {
    appId: false,
    name: false,
    priority: false
  });

  // validate effect
  useEffect(() => {
    instanceInfoValidation(instanceInfo);
  }, [instanceInfo]);
  useEffect(() => {
    sourceDetailsValidation(sourceDetails, argument);
  }, [sourceDetails, argument]);
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
    if (instanceInfo.priority === '') {
      dispatchValidation({ type: 'priority', data: true });
    } else {
      dispatchValidation({ type: 'priority', data: false });
    }
  }
  function sourceDetailsValidation(sourceDetails, argument) {
    if (sourceDetails.provider === '') {
      dispatchValidation({ type: 'provider', data: true });
    } else {
      dispatchValidation({ type: 'provider', data: false });
    }
    if (sourceDetails.provider === 'vap_device_stream') {
      if (sourceDetails.deviceChannelId === '') {
        dispatchValidation({ type: 'deviceChannelId', data: true });
      } else {
        dispatchValidation({ type: 'deviceChannelId', data: false });
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
  function saveInstanceInfoValidation(instanceInfo, sourceDetails, argument) {
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
    if (_.isNil(instanceInfo.priority) || instanceInfo.priority === '') {
      dispatchValidation({ type: 'priority', data: true });
      isValidateOk = false;
    } else {
      dispatchValidation({ type: 'priority', data: false });
    }
    if (_.isNil(sourceDetails.provider) || sourceDetails.provider === '') {
      dispatchValidation({ type: 'provider', data: true });
      isValidateOk = false;
    } else {
      dispatchValidation({ type: 'provider', data: false });
    }
    if (sourceDetails.provider === 'vap_device_stream') {
      if (_.isNil(sourceDetails.deviceChannelId) || sourceDetails.deviceChannelId === '') {
        isValidateOk = false;
        dispatchValidation({ type: 'deviceChannelId', data: true });
      } else {
        dispatchValidation({ type: 'deviceChannelId', data: false });
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
    return isValidateOk;
  }
  function handleSave() {
    const newInstance = _.cloneDeep(instanceInfo);
    const newSourceDetails = _.cloneDeep(sourceDetails);
    const newArgument = _.cloneDeep(argument);
    const newParameters = _.cloneDeep(parameters);

    newSourceDetails.arguments = newArgument;
    newInstance.sourceDetails = newSourceDetails;
    newInstance.parameters = newParameters;
    const validateOk = saveInstanceInfoValidation(newInstance, newSourceDetails, newArgument);

    if (validateOk && editDialogType === 'create') {
      createNewInstance(newInstance);
    } else if (validateOk && editDialogType === 'update') {
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

  // useEffect(() => {
  //   if (!_.isNil(sourceDetails.provider) && sourceDetails.provider !== '') {
  //     getChannelList();
  //   }
  // }, [channelPage, getChannelList, sourceDetails.provider]);

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

  useEffect(() => {
    setArgumentsList(handleGetArgumentsList(sourceDetails.provider, sourceList));
    setChannelNode({});
  }, [sourceDetails.provider, sourceList]);

  useEffect(() => {
    if (sourceDetails.provider === 'vap_device_stream') {
      if (editDialogType === 'update') {
        getChannelList({ channelId: sourceDetails.deviceChannelId });
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
    if (!_.isNil(sourceDetails.deviceChannelId) && sourceDetails.deviceChannelId !== '')
      getRecordingList();
  }, [getRecordingList, sourceDetails.deviceChannelId]);

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
        <JobVaInstanceDetailsBox
          instanceInfo={instanceInfo}
          dispatchInstanceInfo={dispatchInstanceInfo}
          dispatchSourceDetails={dispatchSourceDetails}
          dispatchArgument={dispatchArgument}
          getEngineList={getEngineList}
          engineList={engineData}
          editDialogType={editDialogType}
          validation={validation}
          priorityList={priorityList}
          engineStatusList={engineStatusList}
        />
        <JobVaInstanceSourceBox
          sourceDetails={sourceDetails}
          sourceList={sourceList}
          dispatchSourceDetails={dispatchSourceDetails}
          dispatchArgument={dispatchArgument}
          argument={argument}
          argumentsList={argumentsList}
          dispatchChannelPage={dispatchChannelPage}
          channelPage={channelPage}
          channelList={channelList}
          fileList={fileList}
          filePage={filePage}
          dispatchFilePage={dispatchFilePage}
          recordingList={recordingList}
          editDialogType={editDialogType}
          setChannelNode={setChannelNode}
          validation={validation}
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
        <JobVaInstanceVideoBox
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

JobVaInstanceEditDialog.defaultProps = {
  onClose: () => {},
  open: false,
  getEngineList: () => {},
  createNewInstance: () => {},
  updateInstance: () => {},
  editDialogType: ''
};

JobVaInstanceEditDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  getEngineList: PropTypes.func,
  createNewInstance: PropTypes.func,
  updateInstance: PropTypes.func,
  editDialogType: PropTypes.string
};

export default connect(({ global, JobVaInstance }) => ({
  global,
  JobVaInstance
}))(JobVaInstanceEditDialog);
