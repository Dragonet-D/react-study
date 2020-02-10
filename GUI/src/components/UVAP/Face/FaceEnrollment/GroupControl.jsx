import React, { useState, useCallback, useEffect } from 'react';
import { I18n } from 'react-i18nify';
import { TextField, MultipleSelect, Button } from 'components/common';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PropTypes from 'prop-types';
import store from '@/index';
import { dataUpdatedHandle } from 'utils/helpers';
import msg from 'utils/messageCenter';
import SwitchControl from '../SwitchControl';
import ConfidenceScore from '../ConfidenceScore';
import { getGroupNamesByIds, getGroupIdsByNames } from '../utils';

const useStyles = makeStyles(theme => {
  return {
    left: {
      flex: 12,
      paddingRight: theme.spacing(2)
    },
    left_top: {
      display: 'flex',
      alignItems: 'center'
    },
    space_set: {
      margin: `0 ${theme.spacing(2)}px`,
      flex: 1
    },
    left_bottom: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: theme.spacing(1)
    },
    flex_1: {
      flex: 1
    },
    slider_label: {
      color: theme.palette.text.secondary
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

function GroupControl(props) {
  const moduleName = 'faceEnrollment';
  const classes = useStyles();
  const { dataSource, allTheAppsData } = props;
  const { dispatch } = store;

  const [triggerAlarm, setTriggerAlarm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [enginesRegister, setEnginesRegister] = useState([]);

  useEffect(() => {
    setTriggerAlarm(dataSource.notificationEnabled || false);
    setGroupName(dataSource.name || '');
    setConfidenceScore(dataSource.confidenceThreshold || 0);
    setEnginesRegister(getGroupNamesByIds(dataSource.faceLibraries, allTheAppsData));
  }, [allTheAppsData, dataSource]);

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

  const handleTriggerAlarm = e => {
    const { checked } = e.target;
    setTriggerAlarm(checked);
  };
  const updateGroupList = useCallback(() => {
    dispatch({
      type: `${moduleName}/getFrsGroups`
    });
  }, [dispatch]);
  const handleSave = useCallback(() => {
    dispatch({
      type: `${moduleName}/vapFrsUpdateGroups`,
      payload: {
        id: dataSource.id,
        groupInfo: {
          name: groupName,
          notificationEnabled: triggerAlarm,
          confidenceThreshold: confidenceScore,
          appIDs: getGroupIdsByNames(allTheAppsData, enginesRegister)
        }
      }
    })
      .then(res => {
        dataUpdatedHandle(res, 'Update Group', () => {
          updateGroupList();
        });
      })
      .catch(e => {
        if (e && e.message) {
          msg.error(e.message, 'Update Group');
        }
      });
  }, [
    dispatch,
    dataSource.id,
    groupName,
    triggerAlarm,
    confidenceScore,
    allTheAppsData,
    enginesRegister,
    updateGroupList
  ]);

  const getConfidenceScore = e => {
    setConfidenceScore(e);
  };

  const handleEnginesChange = e => {
    setEnginesRegister(e);
  };

  return (
    <div className={classes.left}>
      <div className={classes.left_top}>
        <TextField
          label={I18n.t('vap.face.faceEnrollment.groupName')}
          fullWidth
          value={groupName}
          onChange={handleChange('groupName')}
          className={classes.flex_1}
        />
        <MultipleSelect
          label={I18n.t('vap.face.faceEnrollment.enginesRegistered')}
          value={enginesRegister}
          selectOptions={allTheAppsData
            .filter(item => item.labels && item.labels.includes('FRS'))
            .map(item => item.name)}
          onSelect={handleEnginesChange}
          className={classes.space_set}
        />
        <SwitchControl
          trigger={triggerAlarm}
          handleTrigger={handleTriggerAlarm}
          label={I18n.t('vap.face.faceEnrollment.triggerAlarm')}
        />
      </div>
      <div className={classes.left_bottom}>
        <div className={classes.flex_1}>
          <ConfidenceScore getValue={getConfidenceScore} defaultValue={confidenceScore} />
        </div>
        <div className={classes.trigger_alarm} onClick={handleSave}>
          <Button variant="contained" color="secondary" size="small">
            {I18n.t('global.button.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}

GroupControl.defaultProps = {
  dataSource: {
    trigger: true,
    group: 'Hello',
    groupDesc: 'Hello World',
    confidenceScore: '0.1',
    enginesRegister: '1'
  },
  allTheAppsData: []
};

GroupControl.propTypes = {
  dataSource: PropTypes.object,
  allTheAppsData: PropTypes.array
};

export default GroupControl;
