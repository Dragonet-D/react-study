import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'dva';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import AlarmConfigVmsSearch from './AlarmConfigVmsSearch';
import AlarmConfigChannel from './AlarmConfigChannel';
import { isEventTypesShow } from './utils';

const useStyles = makeStyles(theme => {
  return {
    form_control: {
      display: 'flex',
      flexDirection: 'row'
    },
    btn: {
      '&:hover': {
        backgroundColor: theme.palette.primary.dark
      }
    },
    btn_active: {
      backgroundColor: theme.palette.primary.dark
    }
  };
});

function AlarmConfigEventTypes(props) {
  const {
    eventTypes,
    tableDataSource,
    getSelectedItems,
    alarmData,
    dispatch,
    global,
    alarmConfiguration
  } = props;
  const { vmsModelsData = [] } = alarmConfiguration || {};
  const { userId } = global;
  const classes = useStyles();

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
  function handleSearch(obj) {
    getChannelsList(obj);
  }

  const handleChannelChange = useCallback(
    obj => {
      getChannelsList(obj);
    },
    [getChannelsList]
  );
  return (
    <div className={classes.wrapper}>
      {isEventTypesShow(eventTypes) && (
        <>
          <AlarmConfigVmsSearch selectOptions={vmsModelsData} onSearch={handleSearch} />
          <AlarmConfigChannel
            alarmData={alarmData}
            dataSource={tableDataSource}
            getSelectedItems={e => getSelectedItems(e)}
            handleChange={handleChannelChange}
          />
        </>
      )}
    </div>
  );
}

export default connect(({ global, alarmConfiguration }) => ({ global, alarmConfiguration }))(
  AlarmConfigEventTypes
);
