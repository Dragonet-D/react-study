import React, { useCallback, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { TabControl } from 'components/Alarm';
import { connect } from 'dva';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SystemAlarmRealtime from './AlarmRealtime';
import AlarmRealtimeVap from './AlarmRealtimeVap';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      height: 'calc(100% - 90px)'
    }
  };
});

function AlarmRealtime(props) {
  const classes = useStyles();
  const { alarmRealtime } = props;
  const { alarmRealtimeData, realTimeAlarmForVAP } = alarmRealtime;

  const [tabValue, setTabValue] = useState(0);
  const [rowSelectItems, setRowSelectItems] = useState([]);
  const onTabChange = useCallback((e, value) => {
    setTabValue(value);
  }, []);

  function getChildRowSelectItems(childRowSelectItems) {
    setRowSelectItems(childRowSelectItems);
  }
  return (
    <>
      <TabControl
        value={tabValue}
        onTabChange={onTabChange}
        alarmRealtimeData={alarmRealtimeData}
        realTimeAlarmForVAP={realTimeAlarmForVAP}
        rowSelectItems={rowSelectItems}
      />
      <Typography component="div" hidden={tabValue !== 0} className={classes.wrapper}>
        <SystemAlarmRealtime getChildRowSelectItems={getChildRowSelectItems} />
      </Typography>
      <Typography component="div" hidden={tabValue !== 1} className={classes.wrapper}>
        <AlarmRealtimeVap getChildRowSelectItems={getChildRowSelectItems} />
      </Typography>
    </>
  );
}

export default connect(({ global, loading, alarmRealtime }) => ({
  global,
  loading,
  alarmRealtime
}))(AlarmRealtime);
