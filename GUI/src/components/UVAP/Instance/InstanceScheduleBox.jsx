import React, { useState, useEffect, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { TextField, SingleSelect, DatePicker, IVHTable } from 'components/common';
import { VAP_COMMON } from 'commons/constants/commonConstant';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddCircle from '@material-ui/icons/AddCircle';
import Delete from '@material-ui/icons/Delete';
import { TIME_FORMAT_HH_MM } from 'commons/constants/const';
import { getCurrentTimeInMinutes, getCurrentTimeWithMinutes } from './util';

const useStyles = makeStyles(theme => {
  return {
    listContainer: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px',
      padding: '0px',
      marginBottom: theme.spacing(2),
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.primary.light}`,
      paddingBottom: theme.spacing(1)
    },
    detailsBox: {
      height: '93%',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      position: 'relative'
    },
    toolbar_button: {
      marginLeft: 'auto',
      marginRight: theme.spacing(2)
    },
    inputBox: {
      display: 'flex',
      alignItems: 'center'
    },
    textField_details: {
      flex: 1,
      marginBottom: theme.spacing(2)
    }
  };
});

const scheduleAction = (info, action) => {
  switch (action.type) {
    case '':
      return action.data;
    case 'name':
      return { ...info, name: action.data };
    case 'timeZone':
      return { ...info, timeZone: action.data };
    default:
      throw new Error();
  }
};

const weeklyPeriodAction = (info, action) => {
  switch (action.type) {
    case '':
      return {
        startMinutes: getCurrentTimeInMinutes(new Date().getTime()),
        endMinutes: getCurrentTimeInMinutes(new Date().getTime())
      };
    case 'dayOfWeek':
      return { ...info, dayOfWeek: action.data };
    case 'endMinutes':
      return { ...info, endMinutes: action.data };
    case 'startMinutes':
      return { ...info, startMinutes: action.data };
    default:
      throw new Error();
  }
};
function InstanceScheduleBox(props) {
  const classes = useStyles();
  const { schedule, dispatchSchedule, validation } = props;

  const [currentSchedule, dispatchCurrentSchedule] = useReducer(scheduleAction, {});
  const [currentWeekly, setCurrentWeekly] = useState([]);
  const [weeklyPeriod, dispatchWeeklyPeriod] = useReducer(weeklyPeriodAction, {
    startMinutes: getCurrentTimeInMinutes(new Date().getTime()),
    endMinutes: getCurrentTimeInMinutes(new Date().getTime())
  });
  const [scheduleError, setSscheduleError] = useState(false);
  const [scheduleErrorMsg, setScheduleErrorMsg] = useState('');

  useEffect(() => {
    dispatchCurrentSchedule({
      type: '',
      data: _.isEmpty(schedule) ? {} : { name: schedule.name, timeZone: schedule.timeZone }
    });
    setCurrentWeekly(schedule.weeklyPeriods || []);
  }, [schedule]);

  function addWeeklyPeriods() {
    if (weeklyPeriod.startMinutes >= weeklyPeriod.endMinutes) {
      setSscheduleError(true);
      setScheduleErrorMsg(I18n.t('vap.dialog.instance.common.ivalidPeriodRange'));
      return false;
    }
    if (_.findIndex(currentWeekly, weeklyPeriod) !== -1) {
      setSscheduleError(true);
      setScheduleErrorMsg(I18n.t('vap.dialog.instance.common.periodsOverlap'));
      return false;
    }

    let isOverlap = false;
    _.forEach(currentWeekly, day => {
      if (
        day.dayOfWeek === weeklyPeriod.dayOfWeek &&
        day.endMinutes > weeklyPeriod.startMinutes &&
        day.startMinutes < weeklyPeriod.endMinutes
      ) {
        isOverlap = true;
        return false;
      }
    });

    if (!isOverlap) {
      setSscheduleError(false);
      setScheduleErrorMsg('');
      currentWeekly.push(weeklyPeriod);
      dispatchSchedule({ type: 'weeklyPeriods', data: _.cloneDeep(currentWeekly) });
    } else {
      isOverlap = true;
      setSscheduleError(true);
      setScheduleErrorMsg(I18n.t('vap.dialog.instance.common.periodsOverlap'));
      return false;
    }
  }
  function deleteWeeklyPeriods(item) {
    _.pullAt(currentWeekly, _.findIndex(currentWeekly, item));
    dispatchSchedule({ type: 'weeklyPeriods', data: _.cloneDeep(currentWeekly) });
  }
  // table columns setting
  const columns = [
    {
      title: I18n.t('vap.dialog.instance.common.week'),
      dataIndex: 'dayOfWeek'
    },
    {
      title: I18n.t('vap.dialog.instance.common.startMinutes'),
      dataIndex: 'startMinutes',
      render: text => (
        <span>
          {`${Math.floor(text / 60)}:${
            text % 60 === 0 ? '00' : text % 60 < 10 ? `0${text % 60}` : text % 60
          }`}
        </span>
      )
    },
    {
      title: I18n.t('vap.dialog.instance.common.endMinutes'),
      dataIndex: 'endMinutes',
      render: text => (
        <span>
          {`${Math.floor(text / 60)}:${
            text % 60 === 0 ? '00' : text % 60 < 10 ? `0${text % 60}` : text % 60
          }`}
        </span>
      )
    }
  ];
  const ExtraCell = item => {
    return (
      <Tooltip title={I18n.t('vap.dialog.instance.common.deletePeriods')}>
        <IconButton
          aria-label={I18n.t('vap.dialog.instance.common.deletePeriods')}
          onClick={() => deleteWeeklyPeriods(item)}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    );
  };
  const extraCell = {
    columns: [
      {
        title: I18n.t('vap.table.common.operation'),
        dataIndex: ''
      }
    ],
    components: [
      {
        component: ExtraCell,
        key: '12'
      }
    ]
  };
  return (
    <div className={classes.listContainer}>
      <div style={{ height: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '15px'
          }}
        >
          <Typography component="h5">
            {I18n.t('vap.dialog.instance.common.scheduleTitle')}
          </Typography>
          {/* <IconButton
            className={classes.toolbar_button}
            onClick={() => console.log(I18n.t('vap.dialog.instance.common.configTitle'))}
          >
            <LibraryAddIcon />
          </IconButton> */}
        </div>

        <div className={classes.detailsBox}>
          <div className={classes.inputBox}>
            <TextField
              label={I18n.t('vap.dialog.instance.common.scheduleName')}
              fullWidth
              placeholder={I18n.t('vap.dialog.instance.common.scheduleNamePlaceholder')}
              value={
                _.isEmpty(currentWeekly) ? 'Not set (24/7 operation)' : currentSchedule.name || ''
              }
              onChange={e => dispatchSchedule({ type: 'name', data: e.target.value })}
              className={classes.textField_details}
              required={!_.isEmpty(currentWeekly)}
              error={validation.scheduleName}
              helperText={
                validation.scheduleName
                  ? I18n.t('vap.dialog.instance.common.scheduleNameErrorMsg')
                  : ''
              }
              disabled={_.isEmpty(currentWeekly)}
            />
            <SingleSelect
              label={I18n.t('vap.dialog.instance.common.timeZone')}
              selectOptions={VAP_COMMON.timezone}
              onSelect={val => dispatchSchedule({ type: 'timeZone', data: val })}
              value={currentSchedule.timeZone || ''}
              error={validation.timeZone}
              errorMessage={
                validation.timeZone ? I18n.t('vap.dialog.instance.common.timeZoneErrorMsg') : ''
              }
              fullWidth
              className={classes.textField_details}
              required={!_.isEmpty(currentWeekly)}
              disabled={_.isEmpty(currentWeekly)}
            />
          </div>
          <div className={classes.inputBox}>
            <SingleSelect
              label={I18n.t('vap.dialog.instance.common.week')}
              selectOptions={VAP_COMMON.days}
              onSelect={val => dispatchWeeklyPeriod({ type: 'dayOfWeek', data: val })}
              value={weeklyPeriod.dayOfWeek || ''}
              fullWidth
              className={classes.textField_details}
              keyValue
              dataIndex={{ name: 'name', value: 'value', key: 'value' }}
            />
            <DatePicker
              value={getCurrentTimeWithMinutes(weeklyPeriod.startMinutes) || ''}
              handleChange={val =>
                dispatchWeeklyPeriod({ type: 'startMinutes', data: getCurrentTimeInMinutes(val) })
              }
              label={I18n.t('vap.dialog.instance.common.startMinutes')}
              maxDate={weeklyPeriod.endMinutes || ''}
              type="time"
              className={classes.textField_details}
              format={TIME_FORMAT_HH_MM}
            />
            <DatePicker
              value={getCurrentTimeWithMinutes(weeklyPeriod.endMinutes) || ''}
              handleChange={val =>
                dispatchWeeklyPeriod({ type: 'endMinutes', data: getCurrentTimeInMinutes(val) })
              }
              label={I18n.t('vap.dialog.instance.common.endMinutes')}
              minDate={weeklyPeriod.startMinutes || ''}
              type="time"
              className={classes.textField_details}
              format={TIME_FORMAT_HH_MM}
            />
            <Tooltip title={I18n.t('vap.dialog.instance.common.addPeriods')}>
              <IconButton
                aria-label={I18n.t('vap.dialog.instance.common.addPeriods')}
                disabled={_.isNil(weeklyPeriod.dayOfWeek) || weeklyPeriod.dayOfWeek === ''}
                onClick={addWeeklyPeriods}
              >
                <AddCircle />
              </IconButton>
            </Tooltip>
          </div>
          {scheduleError && <div style={{ color: 'red' }}>{`* ${scheduleErrorMsg}`}</div>}
          <IVHTable columns={columns} dataSource={currentWeekly} extraCell={extraCell} />
        </div>
      </div>
    </div>
  );
}

InstanceScheduleBox.defaultProps = {
  schedule: {},
  validation: {},
  dispatchSchedule: () => {}
};

InstanceScheduleBox.propTypes = {
  schedule: PropTypes.object,
  validation: PropTypes.object,
  dispatchSchedule: PropTypes.func
};

export default InstanceScheduleBox;
