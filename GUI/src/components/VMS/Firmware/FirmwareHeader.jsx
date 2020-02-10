import React from 'react';
import { makeStyles } from '@material-ui/core';
import { TableToolbar, ToolTip } from 'components/common';
import IconButton from '@material-ui/core/IconButton';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

const useStyles = makeStyles(theme => {
  return {
    icon: {
      color: theme.palette.text.primary
    }
  };
});

function FirmwareHeader(props) {
  const {
    onClickSearch,
    onClickUploadFirmwareFile,
    onClickUploadFirmwareTask,
    datafield,
    getToolBarRef
  } = props;
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
        <ToolTip title="View upgrade task">
          <IconButton aria-label="View upgrade task" onClick={onClickUploadFirmwareTask}>
            <RemoveRedEye className={classes.icon} />
          </IconButton>
        </ToolTip>
        <ToolTip title="Upload">
          <IconButton aria-label="Upload" onClick={onClickUploadFirmwareFile}>
            <LibraryAdd className={classes.icon} />
          </IconButton>
        </ToolTip>
      </div>
      <div>
        <TableToolbar
          handleGetDataByPage={obj => onClickSearch(obj)}
          fieldList={[
            ['FirmwareName', 'firmwareName', 'iptType'],
            ['Model', 'model', 'dropdownType']
          ]}
          getToolBarRef={getToolBarRef}
          dataList={{
            Model: {
              data: datafield,
              type: 'keyVal',
              id: 0,
              val: 1
            }
          }}
        />
      </div>
    </div>
  );
}

export default FirmwareHeader;
