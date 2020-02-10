import React from 'react';
import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import { I18n } from 'react-i18nify';
import moment from 'moment';
import SaveAlt from '@material-ui/icons/SaveAlt';
// import Search from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import { DATE_FORMAT_DATE_PICKER, PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import {
  DatePicker,
  IVHTable,
  Pagination,
  Button,
  TextField,
  DialogTitle,
  ToolTip
} from 'components/common';
import { getCurrentTime, getStartTime } from 'utils/dateHelper';
import msg from 'utils/messageCenter';
// import store from '@/index';

const useStyles = makeStyles(theme => {
  return {
    dialogTitle: {
      color: theme.palette.primary.main,
      fontSize: '1.25rem',
      lineHeight: 1.6,
      letterSpacing: '0.0075em'
    },
    dateTimePicker: {
      // width: 185,
      padding: 5,
      marginRight: theme.spacing(0.5)
    },
    channelinfoWrapper: {
      overflow: 'hidden'
      // height: '100%'
    },
    infoSec: {
      // width: '30%',
      float: 'left'
    },
    fullWidth: {
      width: '100%'
    },
    recordInfoWrapper: {
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    }
  };
});

function ChannelDetail(props) {
  const {
    onClose,
    dataSource,
    getRecords,
    exportRecording,
    itemData,
    userId,
    flagFilterSucc
  } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(PAGE_SIZE);
  const [pageNo, setPageNo] = React.useState(PAGE_NUMBER);
  const [sourceList, setsourceList] = React.useState([]);
  const [renderList, setrenderList] = React.useState([]);
  const [startTime, setstartTime] = React.useState(null);
  const [endTime, setendTime] = React.useState(null);
  const { channelId, channelName, deviceId, groupName, parentDevice } = itemData;
  const { recordPeriod, streamId } = dataSource;

  React.useEffect(() => {
    setsourceList(recordPeriod);
  }, [recordPeriod]);

  React.useEffect(() => {
    setList();
  }, [sourceList]);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    onClose();
  }

  React.useEffect(() => {
    setList();
  }, [pageNo, pageSize]);

  function setList() {
    const start = pageNo * pageSize;
    const pagenation = sourceList.slice(start, start + pageSize);
    setrenderList(pagenation);
  }

  React.useEffect(() => {
    handleClickOpen();
    getRecords({
      channelId,
      channelName,
      deviceId,
      psize: 9999,
      pageNo,
      descriptionFields: {
        'User ID': userId,
        'Channel Name': channelName,
        'Parent Device': parentDevice,
        'Group Name': groupName
      }
    });
  }, []);

  const columns = [
    {
      title: I18n.t('uvms.recording.channelDetail.startTime'),
      dataIndex: 'start',
      render: text => {
        return moment(new Date(parseInt(text, 10))).format(DATE_FORMAT_DATE_PICKER);
      }
    },
    {
      title: I18n.t('uvms.recording.channelDetail.endTime'),
      dataIndex: 'end',
      render: text => {
        return moment(new Date(parseInt(text, 10))).format(DATE_FORMAT_DATE_PICKER);
      }
    }
  ];

  function onChangePage(e, page) {
    setPageNo(page);
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
  }

  function onFocusDateEvent() {
    if (!startTime) {
      setstartTime(getStartTime());
      setendTime(getCurrentTime());
    }
  }
  function handleFilter() {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    if (end - start < 60 * 1000) {
      msg.error('Start time must be earlier than end time', 'Recording Management');
      return;
    }
    getRecords({
      channelId,
      channelName,
      deviceId,
      start,
      end,
      psize: 9999,
      descriptionFields: {
        'User ID': userId,
        'Channel Name': channelName,
        'Parent Device': parentDevice,
        'Group Name': groupName
      }
    });
  }
  function download() {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    if (end - start > 24 * 60 * 60 * 1000) {
      msg.error('Download period can not more than one day', 'Recording Management');
      return;
    }
    if (end <= start) {
      msg.error('Start time must be earlier than end time', 'Recording Management');
      return;
    }
    exportRecording({
      channelId,
      deviceId,
      streamId,
      start,
      end,
      userId,
      descriptionFields: {
        'Channel Name': channelName,
        'End Time': moment(endTime).format('YYYY-MM-DDTHH:mm'),
        'Group Name': groupName,
        'Start Time': moment(startTime).format('YYYY-MM-DDTHH:mm'),
        'User Id': userId
      }
    });
  }
  const fullwidth = true;
  return (
    <>
      <Dialog open={open} fullWidth={fullwidth} maxWidth="sm">
        <DialogTitle>{I18n.t('uvms.recording.channelDetail.channelInfo')}</DialogTitle>
        <DialogContent style={{ height: '50%' }}>
          <div className={classes.channelinfoWrapper}>
            <TextField
              label={I18n.t('uvms.recording.channelDetail.channelName')}
              placeholder={I18n.t('uvms.recording.channelDetail.channelName')}
              value={channelName}
              className={classes.textField}
              margin="dense"
              disabled
              style={{ width: '100%' }}
              className={classes.infoSec}
            />
            <TextField
              label={I18n.t('uvms.recording.channelDetail.parentDevice')}
              placeholder={I18n.t('uvms.recording.channelDetail.parentDevice')}
              value={parentDevice}
              className={classes.textField}
              margin="dense"
              disabled
              style={{ width: '49%' }}
              className={classes.infoSec}
            />
            <TextField
              label={I18n.t('uvms.recording.channelDetail.groupName')}
              placeholder={I18n.t('uvms.recording.channelDetail.groupName')}
              value={groupName}
              className={classes.textField}
              margin="dense"
              disabled
              style={{ width: '49%', float: 'right' }}
              className={classes.infoSec}
            />
          </div>
          <Typography color="textSecondary" variant="h6" style={{ marginTop: 10 }} component="div">
            {I18n.t('uvms.recording.channelDetail.recordingInfo')}
          </Typography>
          <div className={classes.recordInfoWrapper}>
            <div className={classes.dateTimePicker}>
              <DatePicker
                label={I18n.t('uvms.recording.channelDetail.startTime')}
                value={startTime}
                handleChange={val => setstartTime(val)}
                className={classes.textField}
                onFocus={onFocusDateEvent}
                clearable
              />
            </div>
            <div className={classes.dateTimePicker}>
              <DatePicker
                label={I18n.t('uvms.recording.channelDetail.endTime')}
                value={endTime}
                handleChange={val => setendTime(val)}
                className={classes.textField}
                onFocus={onFocusDateEvent}
                clearable
              />
            </div>
            <Button
              color="primary"
              variant="contained"
              disabled={!startTime || !endTime}
              onClick={handleFilter}
            >
              {I18n.t('uvms.recording.button.filter')}
            </Button>
            <ToolTip title={I18n.t('uvms.recording.channelDetail.downloadAll')}>
              <IconButton
                aria-label={I18n.t('uvms.recording.channelDetail.downloadAll')}
                style={{ display: flagFilterSucc ? 'inline' : 'none' }}
                onClick={download}
              >
                <SaveAlt />
              </IconButton>
            </ToolTip>
          </div>
          <>
            <IVHTable
              keyId="start"
              tableMaxHeight="calc(100% - 160px)"
              columns={columns}
              dataSource={renderList}
            />
            <Pagination
              page={pageNo}
              rowsPerPage={pageSize}
              count={(recordPeriod && recordPeriod.length) || 0}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {I18n.t('uvms.recording.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ChannelDetail;
