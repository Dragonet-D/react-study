import React from 'react';
import { TableToolbar, ToolTip } from 'components/common';
import IconButton from '@material-ui/core/IconButton';
import { I18n } from 'react-i18nify';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import SaveAlt from '@material-ui/icons/SaveAlt';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => {
  return {
    button: { color: theme.palette.text.primary }
  };
});

function RecordingHeader(props) {
  const classes = useStyles();
  const { onClickSearch, onClickViewTask, onClickDownloadData } = props;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingLeft: '8px',
        paddingRight: '8px'
      }}
    >
      {/* <div>
        <Button
          variant="contained"
          size="small"
          color="primary"
          className={classes.button}
          onClick={onClickViewTask}
        >
          View Upload Tasks
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          onClick={onClickDownloadData}
        >
          Downloaded Data
        </Button>
      </div> */}
      <div>
        <ToolTip title={I18n.t('uvms.recording.recordingHeader.viewUploadTask')}>
          <IconButton
            aria-label={I18n.t('uvms.recording.recordingHeader.viewUploadTask')}
            onClick={onClickViewTask}
          >
            <RemoveRedEye className={classes.button} />
          </IconButton>
        </ToolTip>
        <ToolTip title={I18n.t('uvms.recording.recordingHeader.download')}>
          <IconButton
            aria-label={I18n.t('uvms.recording.recordingHeader.download')}
            onClick={onClickDownloadData}
          >
            <SaveAlt className={classes.button} />
          </IconButton>
        </ToolTip>
      </div>
      <div>
        <TableToolbar
          handleGetDataByPage={obj => onClickSearch(obj)}
          fieldList={[
            ['ChannelName', 'channelName', 'iptType'],
            ['ParentDevice', 'deviceName', 'iptType'],
            ['Group', 'groupName', 'iptType']
          ]}
        />
      </div>
    </div>
  );
}

export default RecordingHeader;
