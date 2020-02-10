import React, { useState, useCallback, memo, useEffect } from 'react';
import { I18n } from 'react-i18nify';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import _ from 'lodash';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { TextField, MultipleSelect } from 'components/common';
import ConfidenceScore from '../../ConfidenceScore';
import { getGroupNamesByIds, getGroupIdsByNames } from '../../utils';

const useStyles = makeStyles(theme => {
  return {
    trigger_active: {
      color: theme.palette.text.secondary
    },
    flex_1: {
      flex: 1
    },
    trigger_alarm: {
      marginTop: theme.spacing(1),
      marginLeft: `-${theme.spacing(2)}px`
    },
    margin_top: {
      marginTop: theme.spacing(1)
    },
    slider_label: {
      color: theme.palette.text.secondary,
      marginTop: theme.spacing(1)
    },
    slider_wrapper: {
      display: 'flex'
    },
    slider_value: {
      maxWidth: theme.spacing(5),
      textAlign: 'right',
      lineHeight: `${theme.spacing(3)}px`,
      height: theme.spacing(3),
      paddingLeft: theme.spacing(1)
    },
    slider: {
      marginBottom: `-${theme.spacing(1)}px`,
      flex: 1
    },
    delete_wrapper: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    delete_btn: {
      width: theme.spacing(6),
      height: theme.spacing(6)
    }
  };
});

const AddOrUpdateGroup = memo(props => {
  const classes = useStyles();
  const { dataSource, faceEnrollment, getData, isSpecialWatch } = props;
  const { allTheAppsData } = faceEnrollment;
  const [triggerAlarm, setTriggerAlarm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [score, setScore] = useState(0);
  const [enginesRegister, setEnginesRegister] = useState([]);
  const isAddGroup = _.isEmpty(dataSource);

  useEffect(() => {
    if (!isAddGroup) {
      setTriggerAlarm(dataSource.notificationEnabled);
      setGroupName(dataSource.name);
      setScore(dataSource.confidenceThreshold);
      setEnginesRegister(getGroupNamesByIds(dataSource.faceLibraries, allTheAppsData));
    } else if (isSpecialWatch) {
      setGroupName(I18n.t('vap.face.specialWatchList.specialWatchList'));
    }
  }, [dataSource, allTheAppsData, isAddGroup, isSpecialWatch]);

  const get = useCallback(
    (obj = {}) => {
      getData({
        name: groupName,
        notificationEnabled: triggerAlarm,
        confidenceThreshold: score,
        appIDs: getGroupIdsByNames(allTheAppsData, enginesRegister),
        ...obj
      });
    },
    [allTheAppsData, enginesRegister, getData, groupName, score, triggerAlarm]
  );
  useEffect(() => {
    get();
  }, [get]);

  function handleSwitchChange(e) {
    const { checked } = e.target;
    setTriggerAlarm(checked);
  }

  const handleChange = useCallback(
    target => e => {
      const { value } = e.target;
      switch (target) {
        case 'groupName':
          setGroupName(value);
          break;
        default:
          break;
      }
    },
    []
  );

  const handleGetScore = e => {
    setScore(e);
  };

  const handleEnginesRegister = useCallback(e => {
    setEnginesRegister(e);
  }, []);
  return (
    <>
      <TextField
        label={I18n.t('vap.face.faceEnrollment.groupName')}
        fullWidth
        value={groupName}
        onChange={handleChange('groupName')}
        disabled={isSpecialWatch}
      />
      <div className={classes.flex_1}>
        <ConfidenceScore
          className={classes.margin_top}
          getValue={handleGetScore}
          defaultValue={score}
        />
      </div>
      <MultipleSelect
        label={I18n.t('vap.face.faceEnrollment.enginesRegistered')}
        value={enginesRegister}
        selectOptions={allTheAppsData
          .filter(item => item.labels && item.labels.includes('FRS'))
          .map(item => item.name)}
        onSelect={handleEnginesRegister}
        className={classes.margin_top}
      />
      <FormControl className={`${classes.trigger_alarm} ${triggerAlarm && classes.trigger_active}`}>
        <FormControlLabel
          checked={triggerAlarm}
          onChange={handleSwitchChange}
          value={I18n.t('vap.face.faceEnrollment.triggerAlarm')}
          control={<Switch color="primary" />}
          label={I18n.t('vap.face.faceEnrollment.triggerAlarm')}
          labelPlacement="start"
        />
      </FormControl>
    </>
  );
});

AddOrUpdateGroup.defaultProps = {
  dataSource: {}
};

AddOrUpdateGroup.propTypes = {
  dataSource: PropTypes.object
};

export default connect(({ faceEnrollment }) => ({ faceEnrollment }))(AddOrUpdateGroup);
