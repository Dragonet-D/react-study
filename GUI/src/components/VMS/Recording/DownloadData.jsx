import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { I18n } from 'react-i18nify';
import DialogContentText from '@material-ui/core/DialogContentText';
import moment from 'moment';
import { DATE_FORMAT_DATE_PICKER, PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { IVHTable, Pagination, DialogTitle, Button } from 'components/common';

function DownloadData(props) {
  const { onClose, dataSource, getDownloadData } = props;
  const [open, setOpen] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(PAGE_SIZE);
  const [pageNo, setPageNo] = React.useState(PAGE_NUMBER);
  const [formDataSource, setformDataSource] = React.useState(dataSource);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    onClose();
  }

  React.useEffect(() => {
    handleClickOpen();
    getDownloadData({
      psize: pageSize,
      pindex: pageNo,
      start: '',
      status: '',
      streamId: '',
      end: '',
      deviceId: '',
      channelId: ''
    });
  }, []);

  React.useEffect(() => {
    setformDataSource(dataSource);
  }, [dataSource]);

  const columns = [
    {
      title: I18n.t('uvms.recording.downloadData.channelName'),
      dataIndex: 'channel.channelName'
    },
    {
      title: I18n.t('uvms.recording.downloadData.parentDevice'),
      dataIndex: 'channel.parentDevice'
    },
    {
      title: I18n.t('uvms.recording.downloadData.groupName'),
      dataIndex: 'channel.groupName'
    },
    {
      title: I18n.t('uvms.recording.downloadData.startTime'),
      dataIndex: 'start',
      render: text => moment(new Date(text)).format(DATE_FORMAT_DATE_PICKER)
    },
    {
      title: I18n.t('uvms.recording.downloadData.endTime'),
      dataIndex: 'end',
      render: text => moment(new Date(text)).format(DATE_FORMAT_DATE_PICKER)
    },
    {
      title: I18n.t('uvms.recording.downloadData.progress'),
      dataIndex: 'progress'
    }
  ];

  function onChangePage(e, page) {
    setPageNo(page);
    getDownloadData({
      psize: pageSize,
      pindex: page,
      start: '',
      status: '',
      streamId: '',
      end: '',
      deviceId: '',
      channelId: ''
    });
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    getDownloadData({
      psize: value,
      pindex: pageNo,
      start: '',
      status: '',
      streamId: '',
      end: '',
      deviceId: '',
      channelId: ''
    });
  }

  const fullWidth = true;

  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth={fullWidth}
        maxWidth="md"
        style={{
          width: '100%',
          height: 'auto'
        }}
      >
        <DialogTitle>{I18n.t('uvms.recording.downloadData.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <div>
              <IVHTable
                tableMaxHeight="calc(100% - 98px)"
                // handleChooseAll={handleChooseAll}
                // rowSelection={rowSelection}
                keyId="channelUuid"
                columns={columns}
                dataSource={formDataSource}
              />
              <Pagination
                page={pageNo}
                rowsPerPage={pageSize}
                count={formDataSource.length || 0}
                onChangePage={onChangePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {I18n.t('uvms.recording.button.back')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DownloadData;
