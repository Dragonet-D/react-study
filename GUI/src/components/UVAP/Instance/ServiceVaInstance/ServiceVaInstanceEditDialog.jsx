import React, { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { VapDialog, ServiceVaInstanceDetailsBox, InstanceScheduleBox } from 'components/UVAP';
import { I18n } from 'react-i18nify';
import { connect } from 'dva';
import { handleEnginesList } from '../util';

const useStyles = makeStyles(theme => {
  return {
    dialog: {
      width: '40%',
      maxWidth: '40%',
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
      width: '100%',
      padding: '0px',
      marginRight: '6px',
      overflowY: 'auto'
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

const scheduleAction = (info, action) => {
  switch (action.type) {
    case '':
      return action.data;
    case 'name':
      return { ...info, name: action.data };
    case 'timeZone':
      return { ...info, timeZone: action.data };
    case 'weeklyPeriods':
      return { ...info, weeklyPeriods: action.data };
    default:
      throw new Error();
  }
};

function ServiceVaInstanceEditDialog(props) {
  const validate = useRef(null);
  const classes = useStyles();
  const {
    dispatch,
    ServiceVaInstance,
    onClose,
    open,
    getEngineList,
    createNewInstance,
    updateInstance,
    editDialogType,
    engineStatusList
  } = props;
  const { instanceDetails, namespace, engineList } = ServiceVaInstance;
  const moduleName = namespace;
  const dialogTitle =
    editDialogType === 'create'
      ? I18n.t('vap.dialog.instance.service.createTitle')
      : I18n.t('vap.dialog.instance.service.updateTitle');
  // eslint-disable-next-line no-unused-vars
  const [oldData, setOldData] = useState({});
  const [instanceInfo, dispatchInstanceInfo] = useReducer(instanceInfoAction, {});
  const [schedule, dispatchSchedule] = useReducer(scheduleAction, {});

  const [engineData, setEngineData] = useState({});

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
    setEngineData(handleEnginesList(engineList));
  }, [engineList]);

  useEffect(() => {
    setOldData(instanceDetails || {});
    dispatchInstanceInfo({ type: '', data: editDialogType === 'create' ? {} : instanceDetails });
    dispatchSchedule({
      type: '',
      data: editDialogType === 'create' ? {} : instanceDetails.schedule
    });
  }, [instanceDetails, editDialogType]);

  // useEffect(() => {
  //   return () => {
  //     setOldData({});
  //     dispatchInstanceInfo({ type: '', data: {} });
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

  // validate the schedule
  useEffect(() => {
    scheduleValidation(schedule);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule.timeZone, schedule.name]);
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
  // validate effect
  useEffect(() => {
    instanceInfoValidation(instanceInfo);
  }, [instanceInfo]);
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
  }
  function saveInstanceInfoValidation(instanceInfo, schedule) {
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
    let newSchedule = _.cloneDeep(schedule);

    const validateOk = saveInstanceInfoValidation(newInstance, newSchedule);

    if (_.isNil(newSchedule.name) || newSchedule.name === '') {
      newSchedule = null;
    }
    newInstance.schedule = newSchedule;

    if (validateOk && editDialogType === 'create') {
      createNewInstance(newInstance);
    } else if (validateOk && editDialogType === 'update') {
      updateInstance(newInstance);
    }
  }
  function handleClose() {
    onClose();
  }

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
        <ServiceVaInstanceDetailsBox
          instanceInfo={instanceInfo}
          dispatchInstanceInfo={dispatchInstanceInfo}
          getEngineList={getEngineList}
          engineList={engineData}
          // loading={
          //   loading.effects[`${moduleName}/getInstanceDetails`] ||
          //   loading.effects[`${moduleName}/getEngineList`]
          // }
          editDialogType={editDialogType}
          validation={validation}
          engineStatusList={engineStatusList}
        />
        <InstanceScheduleBox
          schedule={schedule}
          validation={validation}
          dispatchSchedule={dispatchSchedule}
        />
      </div>
    </VapDialog>
  );
}

ServiceVaInstanceEditDialog.defaultProps = {
  onClose: () => {},
  open: false,
  getEngineList: () => {},
  createNewInstance: () => {},
  updateInstance: () => {},
  editDialogType: ''
};

ServiceVaInstanceEditDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  getEngineList: PropTypes.func,
  createNewInstance: PropTypes.func,
  updateInstance: PropTypes.func,
  editDialogType: PropTypes.string
};

export default connect(({ global, ServiceVaInstance }) => ({
  global,
  ServiceVaInstance
}))(ServiceVaInstanceEditDialog);
