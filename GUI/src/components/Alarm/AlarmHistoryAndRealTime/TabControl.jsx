import React, { memo } from 'react';
import { I18n } from 'react-i18nify';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { ExportFixedListData } from 'components/common';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: 'flex',
      alignItems: 'center'
    },
    handle: {
      marginLeft: 'auto'
    }
  };
});

const TabControl = memo(props => {
  const classes = useStyles();
  const { value, onTabChange, alarmRealtimeData, realTimeAlarmForVAP, rowSelectItems } = props;
  const dataSource = setExportData();
  function setExportData() {
    if (value === 0) {
      return rowSelectItems.length > 0 ? rowSelectItems : alarmRealtimeData;
    } else {
      return rowSelectItems.length > 0 ? rowSelectItems : realTimeAlarmForVAP;
    }
  }

  return (
    <div className={classes.wrapper}>
      <Tabs value={value} onChange={(e, value) => onTabChange(e, value)}>
        <Tab label={`${I18n.t('alarm.history.systemAlarms')} (${alarmRealtimeData.length})`} />
        <Tab label={`${I18n.t('alarm.history.poiOrVoiAlarms')} (${realTimeAlarmForVAP.length})`} />
        {false && <Tab label={`${I18n.t('alarm.history.anomalyAlarms')} (${22})`} />}
      </Tabs>
      <div className={classes.handle}>
        <ExportFixedListData dataSource={dataSource} name="Alarm Real-time" />
      </div>
    </div>
  );
});

TabControl.defaultProps = {
  onTabChange: () => {},
  value: 0,
  alarmRealtimeData: [],
  realTimeAlarmForVAP: []
};

TabControl.propTypes = {
  onTabChange: PropTypes.func,
  value: PropTypes.number,
  alarmRealtimeData: PropTypes.array,
  realTimeAlarmForVAP: PropTypes.array
};

export default TabControl;
