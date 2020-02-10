import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { SingleSelect, TextField } from 'components/common';
import msg from 'utils/messageCenter';
import { I18n } from 'react-i18nify';
import AlarmDialog from '../AlarmDialog';
import {
  getForceSubscribe,
  getConsolidateNotification,
  TIME_TOO_SMALL,
  TIME_TOO_BIG,
  INPUT_INT
} from './utils';

const useStyles = makeStyles(theme => {
  return {
    dialog: {
      width: '600px',
      maxWidth: '600px'
    },
    margin: {
      marginTop: theme.spacing(2)
    }
  };
});

function AlarmConfigSetting(props) {
  const classes = useStyles();
  const { open, onClose, alarmData, onSave, userId } = props;
  const {
    defaultNotiMethod,
    consolidateToSingleInd,
    forceSubscribe,
    consolidateTimePeriod,
    alarmDefinitionUuid,
    esclateTimePeriod
  } = alarmData;

  const [notification, setNotification] = useState('');
  const [allowUnsubscribe, setAllowUnsubscribe] = useState('');
  const [consolidateNotification, setConsolidateNotification] = useState('');
  const [alarmName, setAlarmName] = useState('');
  const [consolidateTime, setConsolidateTime] = useState(1);
  const [consolidateTimeError, setConsolidateTimeError] = useState(false);
  const [consolidateTimeErrorText, setConsolidateTimeErrorText] = useState('');

  useEffect(() => {
    setNotification(defaultNotiMethod);
    setAllowUnsubscribe(getForceSubscribe(forceSubscribe));
    setConsolidateNotification(getConsolidateNotification(consolidateToSingleInd));
    setAlarmName(alarmData.alarmName || '');
    setConsolidateTime(_.toNumber(consolidateTimePeriod || 1));
  }, [alarmData, consolidateTimePeriod, consolidateToSingleInd, defaultNotiMethod, forceSubscribe]);

  const isConsolidateTimeShow = consolidateNotification === 'Yes';

  function handleNotification(e) {
    setNotification(e);
  }

  function handleAllowUnsubscribe(e) {
    setAllowUnsubscribe(e);
  }

  function handleConsolidateNotification(e) {
    setConsolidateNotification(e);
  }

  function handleSave() {
    if (consolidateTimeError) {
      return;
    }
    const isNotificationEq = notification === defaultNotiMethod;
    const isAllowUnsubscribe = allowUnsubscribe === getForceSubscribe(forceSubscribe);
    const isConsolidateNotification =
      consolidateNotification === getConsolidateNotification(consolidateToSingleInd);
    const isConsolidateTimePeriod = _.isEqualWith(
      consolidateTimePeriod,
      consolidateTime,
      (objValue, othValue) => {
        return _.toNumber(objValue) === _.toNumber(othValue);
      }
    );
    const isNoChange = isNotificationEq && isAllowUnsubscribe && isConsolidateNotification;
    if (isConsolidateTimeShow && isNoChange && isConsolidateTimePeriod) {
      msg.warn(I18n.t('global.popUpMsg.noChange'), 'Alarm Settings');
      return;
    }
    if (!isConsolidateTimeShow && isNoChange) {
      msg.warn(I18n.t('global.popUpMsg.noChange'), 'Alarm Settings');
      return;
    }
    onSave({
      alarmDefinitionUuid,
      defaultNotiMethod: [notification],
      consolidateToSingleInd: consolidateNotification === 'Yes' ? 'Y' : 'N',
      esclateTimePeriod,
      esclateTimePeriodType: 'Minutes',
      userId,
      consolidateTimePeriod: consolidateTime,
      forceSubscribe: allowUnsubscribe === 'Yes' ? 'N' : 'Y'
    });
  }

  function handleClose() {
    onClose();
  }

  function handleAlarmNameChange(e) {
    const { value } = e.target;
    setAlarmName(value);
  }

  function handleConsolidateTimeChange(e) {
    const { value } = e.target;
    if (/^[1-9]\d*$/.test(value)) {
      if (value < 1) {
        setConsolidateTimeError(true);
        setConsolidateTimeErrorText(TIME_TOO_SMALL);
      } else if (value > 999) {
        setConsolidateTimeError(true);
        setConsolidateTimeErrorText(TIME_TOO_BIG);
      } else {
        setConsolidateTimeError(false);
        setConsolidateTimeErrorText('');
      }
    } else {
      setConsolidateTimeError(true);
      setConsolidateTimeErrorText(INPUT_INT);
    }
    setConsolidateTime(value);
  }

  return (
    <AlarmDialog
      open={open}
      title={I18n.t('alarm.config.alarmSettings')}
      handleSave={handleSave}
      handleClose={handleClose}
      dialogWidth={classes.dialog}
    >
      <TextField
        label={I18n.t('alarm.config.alarmName')}
        placeholder={I18n.t('alarm.config.inputAlarmName')}
        value={alarmName}
        onChange={handleAlarmNameChange}
        fullWidth
        disabled
      />
      <div className={classes.margin}>
        <SingleSelect
          label={I18n.t('alarm.config.notificationMethod')}
          onSelect={handleNotification}
          selectOptions={[
            I18n.t('alarm.config.email'),
            I18n.t('alarm.config.sms'),
            I18n.t('alarm.config.onScreen')
          ]}
          value={notification}
        />
      </div>
      <div className={classes.margin}>
        <SingleSelect
          label={I18n.t('alarm.config.allowToUnsubscribeAlarm')}
          onSelect={handleAllowUnsubscribe}
          selectOptions={[I18n.t('alarm.config.yes'), I18n.t('alarm.config.no')]}
          value={allowUnsubscribe}
        />
      </div>
      <div className={classes.margin}>
        <SingleSelect
          label={I18n.t('alarm.config.consolidateToSingleNotification')}
          onSelect={handleConsolidateNotification}
          selectOptions={[I18n.t('alarm.config.yes'), I18n.t('alarm.config.no')]}
          value={consolidateNotification}
        />
      </div>
      {isConsolidateTimeShow && (
        <div className={classes.margin}>
          <TextField
            label={I18n.t('alarm.config.consolidateTimePeriod')}
            value={consolidateTime}
            onChange={handleConsolidateTimeChange}
            InputLabelProps={{
              shrink: true
            }}
            onBlur={() => {}}
            InputProps={{
              endAdornment: <InputAdornment position="end">Minutes</InputAdornment>
            }}
            helperText={consolidateTimeErrorText}
            error={consolidateTimeError}
            fullWidth
          />
        </div>
      )}
    </AlarmDialog>
  );
}

AlarmConfigSetting.defaultProps = {
  open: false,
  onClose: () => {},
  alarmData: {},
  onSave: () => {}
};

AlarmConfigSetting.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  alarmData: PropTypes.object,
  onSave: PropTypes.func
};

export default AlarmConfigSetting;
