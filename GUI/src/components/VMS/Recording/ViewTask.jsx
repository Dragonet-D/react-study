import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import moment from 'moment';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import SaveAlt from '@material-ui/icons/SaveAlt';
import { DATE_FORMAT_DATE_PICKER, PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { DatePicker, IVHTable, Pagination, Button, DialogTitle } from 'components/common';
import DeleteHeader from './DeleteHeader';
import './Recording.module.less';

const useStyles = makeStyles(theme => {
  return {
    dialogTitle: {
      color: theme.palette.primary.main
    },
    dateTimePicker: {
      width: '230px',
      float: 'left',
      marginLeft: theme.spacing(1)
    },
    infoSec: {
      width: '33%',
      float: 'left'
    }
  };
});

function ViewTask(props) {
  const {
    onClose,
    channelList,
    dataSource,
    getTaskList,
    userId,
    downloadRecording,
    viewTaskDelete
  } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(PAGE_SIZE);
  const [pageNo, setPageNo] = React.useState(PAGE_NUMBER);
  const [itemStorage, setitemStorage] = React.useState(new Map());
  const [selectedStorage, setselectedStorage] = React.useState(new Set());
  const [startTime, setstartTime] = React.useState(moment().subtract(1, 'day'));
  const [endTime, setendTime] = React.useState(moment());
  const dataList = useRef(null);
  dataList.current = dataSource;

  const reqBody = channelList.map(x => {
    return { singleChanelDeviceId: x.deviceId, singleChanelId: x.channelId, psize: 9999 };
  });

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    onClose();
  }

  React.useEffect(() => {
    handleClickOpen();
    getTaskList(reqBody);
  }, []);

  React.useEffect(() => {
    setselectedStorage(new Set());
  }, [dataSource]);

  const columns = [
    {
      title: I18n.t('uvms.recording.viewTask.viewTask'),
      dataIndex: 'fileName'
    },
    {
      title: I18n.t('uvms.recording.viewTask.channelName'),
      dataIndex: 'channel.channelName'
    },
    {
      title: I18n.t('uvms.recording.viewTask.parentDevice'),
      dataIndex: 'channel.parentDevice'
    },
    {
      title: I18n.t('uvms.recording.viewTask.groupName'),
      dataIndex: 'channel.groupName'
    },
    {
      title: I18n.t('uvms.recording.viewTask.length'),
      dataIndex: 'length',
      render: text => `${(text / 1024 / 1024).toFixed(2)}MB`
    },
    {
      title: I18n.t('uvms.recording.viewTask.status'),
      dataIndex: 'status'
    }
  ];

  function onChangePage(e, page) {
    setPageNo(page);
    getTaskList(reqBody);
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    getTaskList(reqBody);
  }

  const ExtraCell = item => {
    // const { notificationMethod, defaultNotiMethod } = item;
    return (
      <SaveAlt
        onClick={() => {
          downloadRecording({
            id: [item.fileId],
            channelName: [item.channel.channelName],
            name: [item.fileName],
            descriptionFields: {
              'Channel Name': item.channel.channelName,
              'File Name': item.fileName,
              'User Id': userId
            },
            userId
          });
        }}
      />
    );
  };

  const extraCell = {
    columns: [
      {
        title: 'Operation',
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

  const handleChooseAll = e => {
    const { checked } = e.target;
    const data = _.cloneDeep(selectedStorage);
    const list = dataList.current;
    if (checked) {
      list.forEach(x => {
        data.add(x.fileId);
        itemStorage.set(x.fileId, x);
      });
      setitemStorage(itemStorage);
      setselectedStorage(data);
    } else {
      list.forEach(x => {
        data.delete(x.fileId);
      });
      setselectedStorage(data);
    }
  };

  function handleRowSelection(item, event) {
    const { fileId } = item;
    const { checked } = event.target;
    const data = _.cloneDeep(selectedStorage);
    if (checked) {
      setselectedStorage(data.add(fileId));
      setitemStorage(itemStorage.set(fileId, item));
    } else {
      data.delete(fileId);
      setselectedStorage(data);
    }
  }

  const rowSelection = {
    onChange: handleRowSelection,
    selectedRowKeys: [...selectedStorage]
  };

  const viewTaskhandleDelete = () => {
    viewTaskDelete(
      {
        id: [...selectedStorage],
        descriptionFields: {
          'User ID': userId,
          'End Time': moment(endTime).format('DD/MM/YYYY'),
          'Start Time': moment(startTime).format('DD/MM/YYYY')
        }
      },
      reqBody
    );
  };

  return (
    <div>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        style={{
          width: '100%',
          height: 'auto'
        }}
      >
        <DialogTitle>{I18n.t('uvms.recording.viewTask.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <div style={{ position: 'relative' }}>
              {[...selectedStorage].length > 0 && (
                <DeleteHeader
                  handleDelete={viewTaskhandleDelete}
                  numSelected={[...selectedStorage]}
                  iconInfo={{
                    icon: 'delete',
                    label: 'Delete Alarm'
                  }}
                />
              )}
              <div style={{ width: '100%', height: '60px', display: 'flex', alignItems: 'center' }}>
                <div className={classes.dateTimePicker}>
                  <DatePicker
                    date={moment(startTime).format('YYYY-MM-DDTHH:mm')}
                    label={I18n.t('uvms.recording.viewTask.startTime')}
                    format={DATE_FORMAT_DATE_PICKER}
                    handleChange={val => setstartTime(moment(val))}
                    value={moment(startTime).format('YYYY-MM-DDTHH:mm')}
                    style={{ width: 215 }}
                    className={classes.textField}
                  />
                </div>

                <div className={classes.dateTimePicker}>
                  <DatePicker
                    date={moment(endTime).format('YYYY-MM-DDTHH:mm')}
                    label={I18n.t('uvms.recording.viewTask.endTime')}
                    format={DATE_FORMAT_DATE_PICKER}
                    value={moment(endTime).format('YYYY-MM-DDTHH:mm')}
                    handleChange={val => setendTime(moment(val))}
                    style={{ width: 215 }}
                    className={classes.textField}
                  />
                </div>

                <Button
                  variant="contained"
                  onClick={() => {
                    getTaskList(reqBody);
                  }}
                  // style={{ height: '60px', width: '90px' }}
                >
                  {I18n.t('uvms.recording.button.filter')}
                </Button>
              </div>
            </div>
            <div>
              <IVHTable
                tableMaxHeight="calc(100% - 98px)"
                handleChooseAll={handleChooseAll}
                rowSelection={rowSelection}
                keyId="fileId"
                columns={columns}
                dataSource={dataSource}
                extraCell={extraCell}
              />
              <Pagination
                page={pageNo}
                rowsPerPage={pageSize}
                count={(dataSource && dataSource.length) || 0}
                onChangePage={onChangePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {I18n.t('uvms.recording.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ViewTask;
