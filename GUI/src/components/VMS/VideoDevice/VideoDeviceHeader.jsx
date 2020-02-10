import React from 'react';
import { makeStyles } from '@material-ui/core';
import { TableToolbar, ToolTip } from 'components/common';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';

const useStyles = makeStyles(theme => {
  return {
    button: {
      margin: theme.spacing(1),
      // height: '32px'
      // fontSize: '0.3rem'
      cursor: 'pointer'
    }
  };
});

function VideoDeviceHeader(props) {
  const { onClickSearch, onClickAddDevice, onClickBatchAdd, datafield, getToolBarRef } = props;
  const classes = useStyles();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingLeft: '8px',
        paddingRight: '8px'
        // height: '90px'
      }}
    >
      <div>
        <ToolTip title="Batch Add">
          <PlaylistAdd className={classes.button} onClick={onClickBatchAdd} />
        </ToolTip>
        <ToolTip title="Add Device">
          <LibraryAdd className={classes.button} onClick={onClickAddDevice} />
        </ToolTip>
      </div>
      <div>
        <TableToolbar
          handleGetDataByPage={obj => onClickSearch(obj)}
          fieldList={[
            ['DeviceName', 'deviceName', 'iptType'],
            ['Device_URI', 'deviceUri', 'iptType'],
            ['Model', 'modelId', 'dropdownType'],
            ['AvailableChannels', 'channelCount', 'iptType'],
            ['Status', 'vmsStatus', 'dropdownType']
          ]}
          getToolBarRef={getToolBarRef}
          dataList={{
            Model: {
              data: datafield,
              type: 'keyVal',
              id: 0,
              val: 1
            },
            Status: {
              data: ['active', 'unavailable', 'authentication-failed', 'disconnected']
            }
          }}
        />
      </div>
    </div>
  );
}

export default VideoDeviceHeader;
