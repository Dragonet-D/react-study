import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { I18n } from 'react-i18nify';
import _ from 'lodash';
import moment from 'moment';

import { DATE_FORMAT_DATE_PICKER, PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { DatePicker, IVHTable, Pagination, Button, DialogTitle } from 'components/common';

const useStyles = makeStyles(theme => {
  return {
    dateTimePicker: {
      width: '230px',
      float: 'left',
      marginLeft: theme.spacing(1)
    }
  };
});

function ViewUpgradeTask(props) {
  const {
    onClose,

    dataSource,
    getUpgradeList,
    DeleteHeader,
    viewUpgradeTaskhandleDelete
  } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(PAGE_SIZE);
  const [pageNo, setPageNo] = React.useState(PAGE_NUMBER);
  const [startTime, setstartTime] = React.useState(moment().subtract(1, 'day'));
  const [endTime, setendTime] = React.useState(moment());
  const [itemStorage, setitemStorage] = React.useState(new Map());
  const [selectedStorage, setselectedStorage] = React.useState(new Set());
  const [renderList, setrenderList] = React.useState([]);
  const [listLength, setlistLength] = React.useState(0);
  const dataList = useRef(null);
  const range = useRef(null);
  function handleClickOpen() {
    setOpen(true);
  }

  function dataListFilter(filter) {
    const renderArr = [];
    const { pageSize, pageNo, deviceId, timeRange } = filter;
    const list = dataList.current;

    // function search() {}
    for (let i = 0; i < list.length; i++) {
      let df = false;
      let tr = false;
      let ts = moment(new Date(list[i].dueTime));
      if (deviceId && deviceId.length && list[i].deviceId === deviceId) {
        df = true;
      }
      if (deviceId === '' || !deviceId) {
        df = true;
      }
      if (timeRange && ts.isBetween(startTime, endTime)) {
        tr = true;
      }
      if (!timeRange) {
        tr = true;
      }
      if (df && tr) {
        renderArr.push(list[i]);
      }
    }
    setlistLength(renderArr.length);
    return renderArr.slice(pageNo * pageSize, pageNo * pageSize + pageSize);
  }

  function handleClose() {
    setOpen(false);
    onClose();
  }

  React.useEffect(() => {
    setselectedStorage(new Set());
    dataList.current = dataSource;
    range.current = null;
    if (dataSource) {
      setrenderList(dataListFilter({ pageSize: 5, pageNo: 0 }));
    }
  }, [dataSource]);

  React.useEffect(() => {
    if (dataList.current) {
      setrenderList(dataListFilter({ pageSize, pageNo, deviceId: '', timeRange: range.current }));
    }
  }, [pageNo, pageSize]);

  React.useEffect(() => {
    handleClickOpen();
    getUpgradeList({ psize: 9999, pindex: pageNo, model: '', deviceId: '' });
  }, []);

  const columns = [
    {
      title: I18n.t('uvms.firmware.firmwareUpload.firmwareName'),
      dataIndex: 'firmwareName'
    },
    {
      title: I18n.t('uvms.firmware.firmwareUpload.deviceName'),
      dataIndex: 'deviceName'
    },
    {
      title: I18n.t('uvms.firmware.firmwareUpload.dueTime'),
      dataIndex: 'dueTime',
      render: text => moment(new Date(text)).format(DATE_FORMAT_DATE_PICKER)
    },
    {
      title: I18n.t('uvms.firmware.firmwareUpload.progress'),
      dataIndex: 'progress'
    },
    {
      title: I18n.t('uvms.firmware.firmwareUpload.status'),
      dataIndex: 'status'
    }
  ];

  function onChangePage(e, page) {
    setPageNo(page);
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
  }

  function handleRowSelection(item, event) {
    const { id } = item;
    const { checked } = event.target;
    const data = _.cloneDeep(selectedStorage);
    if (checked) {
      setselectedStorage(data.add(id));
      setitemStorage(itemStorage.set(id, item));
    } else {
      data.delete(id);
      setselectedStorage(data);
    }
  }

  function recordingTimeFilter() {
    range.current = { startTime, endTime };
    setrenderList(
      dataListFilter({ pageSize: 5, pageNo: 0, deviceId: '', timeRange: range.current })
    );
  }

  const handleChooseAll = e => {
    const { checked } = e.target;
    const data = _.cloneDeep(selectedStorage);
    const list = dataList.current;
    if (checked) {
      list.forEach(x => {
        data.add(x.id);
        itemStorage.set(x.id, x);
      });
      setitemStorage(itemStorage);
      setselectedStorage(data);
    } else {
      list.forEach(x => {
        data.delete(x.id);
      });
      setselectedStorage(data);
    }
  };

  const rowSelection = {
    onChange: handleRowSelection,
    selectedRowKeys: [...selectedStorage]
  };

  return (
    <div>
      <Dialog
        open={open}
        maxWidth="lg"
        fullWidth
        style={{
          width: '100%',
          height: 'auto'
        }}
      >
        <DialogTitle>{I18n.t('uvms.firmware.firmwareUpload.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <div style={{ position: 'relative' }}>
              {[...selectedStorage].length > 0 && (
                <DeleteHeader
                  handleDelete={() => {
                    viewUpgradeTaskhandleDelete(
                      {
                        id: [...selectedStorage]
                      },
                      { psize: 9999, pindex: pageNo, model: '', deviceId: '' }
                    );
                  }}
                  numSelected={[...selectedStorage]}
                  iconInfo={{
                    icon: 'delete',
                    label: I18n.t('uvms.firmware.firmwareUpload.deleteTask')
                  }}
                />
              )}
              <div style={{ width: '100%', height: '60px', display: 'flex', alignItems: 'center' }}>
                <div className={classes.dateTimePicker}>
                  <DatePicker
                    date={moment(startTime).format('YYYY-MM-DDTHH:mm')}
                    label={I18n.t('uvms.firmware.firmwareUpload.startTime')}
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
                    label={I18n.t('uvms.firmware.firmwareUpload.endTime')}
                    format={DATE_FORMAT_DATE_PICKER}
                    value={moment(endTime).format('YYYY-MM-DDTHH:mm')}
                    handleChange={val => setendTime(moment(val))}
                    style={{ width: 215 }}
                    className={classes.textField}
                  />
                </div>

                <Button
                  variant="contained"
                  onClick={recordingTimeFilter}
                  // style={{ height: '60px', width: '90px' }}
                >
                  {I18n.t('uvms.firmware.button.filter')}
                </Button>
              </div>
            </div>

            <div>
              <IVHTable
                tableMaxHeight="calc(100% - 98px)"
                handleChooseAll={handleChooseAll}
                rowSelection={rowSelection}
                keyId="id"
                columns={columns}
                dataSource={renderList}
              />
              <Pagination
                page={pageNo}
                rowsPerPage={pageSize}
                count={listLength || 0}
                onChangePage={onChangePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {I18n.t('uvms.firmware.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ViewUpgradeTask;
