import React from 'react';
import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import Typography from '@material-ui/core/Typography';
import { PAGE_NUMBER, PAGE_SIZE, DATE_FORMAT } from 'commons/constants/const';
import {
  DatePicker,
  IVHTable,
  Pagination,
  Button,
  TextField,
  DialogTitle
} from 'components/common';
import { getCurrentTime } from 'utils/dateHelper';
import moment from 'moment';

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
    },
    centerLine: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    startLine: {
      display: 'flex',
      justifyContent: 'flex-start'
    }
  };
});

function FirmwareUpgrade(props) {
  const {
    onClose,
    dataSource,
    getFirmwareUpgradeDeviceList,
    getSelectedDeviceArray,
    upgradeContent,
    selectedDeviceArray,
    cleanData,
    firmwareUpgrade
  } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(PAGE_SIZE);
  const [pageNo, setPageNo] = React.useState(PAGE_NUMBER);
  const [uploadTime, setuploadTime] = React.useState(getCurrentTime());
  const [itemStorage, setitemStorage] = React.useState(new Map());
  const [selectedStorage, setselectedStorage] = React.useState(new Set());
  const [receivedDataSource, setreceivedDataSource] = React.useState([]);

  const modelId = upgradeContent.item.firmwareModelId;
  const deviceName = upgradeContent.item.deviceName || '';
  const hidePicker = upgradeContent.type === 'Immediate';
  const dataList = React.useRef(null);
  dataList.current = dataSource.items;

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    cleanData();
    setitemStorage(new Map());
    setselectedStorage(new Set());
    setreceivedDataSource([]);
    setOpen(false);
    onClose();
  }

  React.useEffect(() => {
    handleClickOpen();
    getSelectedDeviceArray({ firmwareId: upgradeContent.item.firmwareId });
    getFirmwareUpgradeDeviceList({ pageSize, pageNo, modelId });
    return () => {
      setitemStorage(new Map());
      setselectedStorage(new Set());
      setreceivedDataSource([]);
    };
  }, []);

  React.useEffect(() => {
    setselectedStorage(new Set(selectedDeviceArray));
  }, [selectedDeviceArray]);

  React.useEffect(() => {
    if (dataSource && dataSource.items) {
      setreceivedDataSource(dataSource.items);
      const data = _.cloneDeep(itemStorage);
      dataSource.items.map(x => {
        data.set(x.deviceId, x);
        return x;
      });
      setitemStorage(data);
    }
  }, [dataSource]);

  const columns = [
    {
      title: I18n.t('uvms.firmware.firmwareUpgrade.deviceName'),
      dataIndex: 'deviceName'
    },
    {
      title: I18n.t('uvms.firmware.firmwareUpgrade.deviceType'),
      dataIndex: 'deviceType'
    },
    {
      title: I18n.t('uvms.firmware.firmwareUpgrade.uri'),
      dataIndex: 'deviceUri'
    },
    {
      title: I18n.t('uvms.firmware.firmwareUpgrade.model'),
      dataIndex: 'modelName'
    },
    {
      title: I18n.t('uvms.firmware.firmwareUpgrade.firmwareVersion'),
      dataIndex: 'firmware'
    },
    {
      title: I18n.t('uvms.firmware.firmwareUpgrade.lastUpdatedBy'),
      dataIndex: 'lastUpdatedId'
    },
    {
      title: I18n.t('uvms.firmware.firmwareUpgrade.lastUpdatedDate'),
      dataIndex: 'lastUpdatedDate',
      render: x => moment(x).format(DATE_FORMAT)
    },
    {
      title: I18n.t('uvms.firmware.firmwareUpgrade.status'),
      dataIndex: 'vmsStatus'
    }
  ];

  function onChangePage(e, page) {
    setPageNo(page);
    getFirmwareUpgradeDeviceList({ pageSize, pageNo: page });
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
    getFirmwareUpgradeDeviceList({ pageSize: value, pageNo });
  }

  function onFirmwareUpgrade() {
    const time = upgradeContent.type === 'Immediate' ? new Date().getTime() : uploadTime;
    firmwareUpgrade({
      deviceId: [...selectedStorage],
      dueTime: time,
      firmwareId: upgradeContent.item.firmwareId
    });
  }

  function handleRowSelection(item, event) {
    const { deviceId } = item;
    const { checked } = event.target;
    const data = _.cloneDeep(selectedStorage);
    if (checked) {
      setselectedStorage(data.add(deviceId));
      setitemStorage(itemStorage.set(deviceId, item));
    } else {
      data.delete(deviceId);
      setselectedStorage(data);
    }
  }

  function handleChooseAll(e) {
    const { checked } = e.target;
    const data = _.cloneDeep(selectedStorage);
    const list = dataList.current;
    if (checked) {
      list.forEach(x => {
        data.add(x.deviceId);
        itemStorage.set(x.deviceId, x);
      });
      setitemStorage(itemStorage);
      setselectedStorage(data);
    } else {
      list.forEach(x => {
        data.delete(x.deviceId);
      });
      setselectedStorage(data);
    }
  }

  const rowSelection = {
    onChange: handleRowSelection,
    selectedRowKeys: [...selectedStorage]
  };

  const fullwidth = true;

  return (
    <div>
      <Dialog open={open} fullWidth={fullwidth} maxWidth="md">
        <DialogTitle>{hidePicker ? 'Immediate Upgrade' : 'Schedule Upgrade'}</DialogTitle>
        <DialogContent>
          <DialogContentText component="div" className={classes.centerLine}>
            <TextField
              label={I18n.t('uvms.firmware.firmwareUpgrade.deviceModel')}
              value={upgradeContent.item.firmwareModelName}
              margin="dense"
              style={{ width: '33%' }}
              disabled
            />
            <TextField
              label={I18n.t('uvms.firmware.firmwareUpgrade.firmwareName')}
              value={upgradeContent.item.firmwareName}
              margin="dense"
              style={{ width: '33%' }}
              disabled
            />
            <TextField
              label={I18n.t('uvms.firmware.firmwareUpgrade.firmwareVersion')}
              value={upgradeContent.item.firmwareVersion}
              margin="dense"
              style={{ width: '33%' }}
              disabled
            />
          </DialogContentText>
          <Typography color="textSecondary" variant="h6" style={{ marginTop: 10 }} component="div">
            {I18n.t('uvms.firmware.firmwareUpgrade.title')}
          </Typography>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <div>
              <div>
                <IVHTable
                  tableMaxHeight="calc(100% - 98px)"
                  handleChooseAll={handleChooseAll}
                  rowSelection={rowSelection}
                  keyId="deviceId"
                  columns={columns}
                  dataSource={receivedDataSource}
                />
                <Pagination
                  page={pageNo}
                  rowsPerPage={pageSize}
                  count={receivedDataSource.length || 0}
                  onChangePage={onChangePage}
                  onChangeRowsPerPage={onChangeRowsPerPage}
                />
              </div>
              <div hidden={hidePicker}>
                <div className={classes.dateTimePicker}>
                  <DatePicker
                    label={I18n.t('uvms.firmware.firmwareUpgrade.uploadTime')}
                    value={uploadTime}
                    handleChange={val => setuploadTime(val)}
                    className={classes.textField}
                  />
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onFirmwareUpgrade} color="primary">
            {I18n.t('uvms.firmware.button.save')}
          </Button>
          <Button onClick={handleClose} color="primary">
            {I18n.t('uvms.firmware.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FirmwareUpgrade;
