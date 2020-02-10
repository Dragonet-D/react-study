import React from 'react';
import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Paper from '@material-ui/core/Paper';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import DialogContentText from '@material-ui/core/DialogContentText';
import { I18n } from 'react-i18nify';
import _ from 'lodash';
import moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import { DATE_FORMAT_DATE_PICKER, PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import {
  TextField,
  DatePicker,
  IVHTable,
  Pagination,
  Button,
  DialogTitle,
  MapSketch
} from 'components/common';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
// import ConfirmPop from './ConfirmPop';

const useStyles = makeStyles(theme => {
  return {
    dialogTitle: {
      color: theme.palette.primary.main
    },
    centerLine: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    startLine: {
      display: 'flex',
      justifyContent: 'flex-start'
    },
    paper: {
      height: '400px'
    }
  };
});

function RequestInfo(props) {
  const {
    onClose,
    itemData,
    channelList,
    userId,
    setconfirmPop,
    getChannelList,
    permissionList
  } = props; // requestAction,
  const {
    requestGroupName,
    requestReason,
    requestUsername,
    requestStatusDesc,
    requestorGroupname,
    startDate,
    endDate,
    rejectReason,
    channels,
    perpetual,
    accessPermission
  } = itemData;
  const perprrrr = perpetual === 'N';
  const SD = startDate ? moment(startDate) : moment();
  const ED = endDate ? moment(endDate) : moment();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  // const [renderList, setrenderList] = React.useState([]);
  const [sourceList, setsourceList] = React.useState([]);
  const [flagPerpetual, setflagPerpetual] = React.useState(perprrrr);
  const [revokeReason, setrevokeReason] = React.useState('');
  const [itemStorage, setitemStorage] = React.useState(new Map());
  const [selectedStorage, setselectedStorage] = React.useState(new Set([...channels]));
  const [pageSize, setPageSize] = React.useState(PAGE_SIZE);
  const [pageNo, setPageNo] = React.useState(PAGE_NUMBER);
  // const [context, setcontext] = React.useState(false);
  // const [confirmPop, setconfirmPop] = React.useState(false);
  const [startTime, setstartTime] = React.useState(SD);
  const [endTime, setendTime] = React.useState(ED);
  const [errorChannel, seterrorChannel] = React.useState(true);
  const [errorRject, seterrorStatus] = React.useState(false);
  const [permissionCheck, setPermissionCheck] = React.useState(new Set());
  const selectionShow = requestStatusDesc === 'Pending';

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    onClose();
  }

  React.useEffect(() => {
    getChannelList({ pageNo: pageNo, pageSize: pageSize });
  }, [pageNo, pageSize]);

  React.useEffect(() => {
    setPermissionCheck(new Set(accessPermission));
  }, []);

  React.useEffect(() => {
    handleClickOpen();
    const list = _.cloneDeep(channelList);
    let source = [];
    if (!selectionShow) {
      list.items.forEach(y => {
        y.disabled = true;
        source.push(y);
      });
      source = list;
    } else {
      source = channelList;
    }
    setsourceList(source);
  }, [channelList]);

  const columns = [
    {
      title: I18n.t('uvms.channel.config.channelName'),
      dataIndex: 'channelName'
    },
    {
      title: I18n.t('uvms.channel.config.parentDevice'),
      dataIndex: 'parentDevice'
    },
    {
      title: I18n.t('uvms.channel.config.uri'),
      dataIndex: 'deviceUri'
    },
    {
      title: I18n.t('uvms.channel.config.groupName'),
      dataIndex: 'groupName'
    },
    {
      title: I18n.t('uvms.channel.config.recordingSchedule'),
      dataIndex: 'scheduleName'
    },
    {
      title: I18n.t('uvms.channel.config.model'),
      dataIndex: 'modelId'
    },
    {
      title: I18n.t('uvms.channel.config.status'),
      dataIndex: 'vmsStatus'
    }
  ];

  function onChangePage(e, page) {
    setPageNo(page);
  }

  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageSize(value);
  }

  function handleApprove(type) {
    if (!revokeReason && type !== 'Approve') {
      seterrorStatus(true);
      return;
    }
    const accessPermission = [...permissionCheck].join(',');
    const {
      requestBy,
      requestGroup,
      requestReason,
      approvedBy,
      requestStatus,
      requestId
    } = itemData;
    const payload = {
      requestBy,
      requestGroup,
      requestReason,
      approvedBy,
      accessPermission,
      requestStatus,
      requestId,
      channels: [...selectedStorage],
      perpetual: flagPerpetual ? 'Y' : 'N',
      startDate: moment(startTime).format('DD/MM/YYYY'),
      endDate: flagPerpetual ? '' : moment(endTime).format('DD/MM/YYYY'),

      lastUpdatedId: userId
    };

    let descriptionFields = null;

    const channelName = [];
    if (selectionShow) {
      selectedStorage.forEach(x => channelName.push(itemStorage.get(x).channelName));
    }

    if (type === 'Approve' && selectedStorage.size) {
      payload.approvedBy = userId;
      payload.requestStatus = 'A';
      payload.requestStatusDesc = 'Approved';
      descriptionFields = {
        Channels: channelName,
        'Request By': requestBy,
        'Approved By': userId,
        'Request Group': requestGroupName,
        'Request Status': 'Approved'
      };
      setconfirmPop('Approve', { descriptionFields, ...payload });
    } else if (type === 'Approve') {
      seterrorChannel(false);
    }
    if (type === 'Reject' && revokeReason.length) {
      payload.requestStatus = 'J';
      payload.approvedBy = userId;
      payload.requestStatusDesc = 'Rejected';
      payload.rejectReason = revokeReason;
      descriptionFields = {
        Channels: channelName,
        'Request By': requestBy,
        'Rejected By': userId,
        'Request Group': requestGroupName,
        'Request Status': 'Rejected',
        'Request Reason': requestReason,
        'Reject Reason': revokeReason
      };

      setconfirmPop('Reject', { descriptionFields, ...payload });
    } else if (type === 'Reject') {
      seterrorStatus(false);
    }
    if (type === 'Revoke' && revokeReason.length) {
      payload.requestStatus = 'R';
      payload.requestStatusDesc = 'Revoked';
      payload.approvedBy = userId;
      payload.rejectReason = revokeReason;
      descriptionFields = {
        Channels: channelName,
        'Request By': requestBy,
        'Revoke By': userId,
        'Request Group': requestGroupName,
        'Request Status': 'Revoked',
        'Request Reason': requestReason,
        'Revoke Reason': revokeReason
      };
      payload.channels = [...channels];
      setconfirmPop('Revoke', { descriptionFields, ...payload });
    } else if (type === 'Revoke') {
      seterrorStatus(false);
    }
  }
  function handleFocus() {
    seterrorStatus(false);
  }

  function handleChooseAll(e) {
    const { checked } = e.target;
    const data = _.cloneDeep(selectedStorage);
    if (checked) {
      seterrorChannel(true);
      sourceList.items.map(x => {
        data.add(x.channelId);
        itemStorage.set(x.channelId, x);
        return x;
      });
      setitemStorage(itemStorage);
      setselectedStorage(data);
    } else {
      sourceList.items.map(x => {
        data.delete(x.channelId);
        return x;
      });
      setselectedStorage(data);
    }
  }

  function handleRowSelection(item, event) {
    const { channelId } = item;
    const { checked } = event.target;
    const data = _.cloneDeep(selectedStorage);
    if (checked) {
      seterrorChannel(true);
      setselectedStorage(data.add(channelId));
      setitemStorage(itemStorage.set(channelId, item));
    } else {
      data.delete(channelId);
      setselectedStorage(data);
    }
  }

  function renderAction() {
    switch (requestStatusDesc) {
      case 'Revoked':
        return (
          <React.Fragment>
            <div className={classes.startLine}>
              <TextField
                value={moment(startDate).format('DD/MM/YYYY')}
                margin="dense"
                disabled
                label="Effective Start Date"
                style={{ width: '33%', marginRight: 5 }}
                // fullWidth
              />
              <TextField
                value={moment(endDate).format('DD/MM/YYYY')}
                margin="dense"
                disabled
                label="Effective End Date"
                style={{ width: '33%', marginRight: 5 }}
                // fullWidth
              />
              <div>
                <label style={{ width: '33%' }}>Perpetual</label>
                <Checkbox
                  checked={flagPerpetual}
                  onChange={() => {
                    setflagPerpetual(!flagPerpetual);
                  }}
                  value="checkedA"
                  disabled
                />
              </div>
            </div>
            <TextField
              value={rejectReason}
              margin="dense"
              label="Revoke Reason"
              fullWidth
              disabled
            />
          </React.Fragment>
        );

      case 'Rejected':
        return (
          <TextField value={rejectReason} margin="dense" label="Revoke Reason" fullWidth disabled />
        );
      case 'Pending':
        return (
          <React.Fragment>
            <div className={classes.startLine}>
              <DatePicker
                date={moment(startTime).format('YYYY-MM-DDTHH:mm')}
                label="Start Time"
                format={DATE_FORMAT_DATE_PICKER}
                handleChange={val => setstartTime(moment(val))}
                value={moment(startTime).format('YYYY-MM-DDTHH:mm')}
                className={classes.textField}
                style={{ marginRight: 5 }}
              />
              <DatePicker
                date={moment(endTime).format('YYYY-MM-DDTHH:mm')}
                label="End Time"
                format={DATE_FORMAT_DATE_PICKER}
                value={moment(endTime).format('YYYY-MM-DDTHH:mm')}
                handleChange={val => setendTime(moment(val))}
                className={classes.textField}
                disabled={flagPerpetual}
                style={{ marginRight: 5 }}
              />
              <div>
                <label style={{ width: '10%' }}>Perpetual</label>
                <Checkbox
                  checked={flagPerpetual}
                  onChange={() => {
                    setflagPerpetual(!flagPerpetual);
                  }}
                  value="checkedA"
                />
              </div>
            </div>
            <TextField
              label="Reject Reason"
              error={errorRject}
              value={revokeReason}
              helperText={errorRject ? 'Please input reject reason' : ''}
              onChange={e => {
                setrevokeReason(e.target.value);
                // if (e.target.value.length) {
                //   seterrorStatus(true);
                // }
              }}
              onFocus={handleFocus}
              fullWidth
            />
          </React.Fragment>
        );
      case 'Approved':
        return (
          <React.Fragment>
            <div className={classes.startLine}>
              <DatePicker
                date={moment(startTime).format('YYYY-MM-DDTHH:mm')}
                label="Start Time"
                format={DATE_FORMAT_DATE_PICKER}
                handleChange={val => setstartTime(moment(val))}
                value={moment(startTime).format('YYYY-MM-DDTHH:mm')}
                className={classes.textField}
                disabled
                style={{ marginRight: 5 }}
              />
              <DatePicker
                date={moment(endTime).format('YYYY-MM-DDTHH:mm')}
                label="End Time"
                format={DATE_FORMAT_DATE_PICKER}
                value={moment(endTime).format('YYYY-MM-DDTHH:mm')}
                handleChange={val => setendTime(moment(val))}
                className={classes.textField}
                disabled
                style={{ marginRight: 5 }}
              />
              <div>
                <label style={{ width: '10%' }}>Perpetual</label>
                <Checkbox
                  checked={flagPerpetual}
                  onChange={() => {
                    setflagPerpetual(!flagPerpetual);
                  }}
                  value="checkedA"
                  disabled
                />
              </div>
            </div>
            <TextField
              error={errorRject}
              helperText={errorRject ? 'Please input revoke reason' : ''}
              label="Revoke Reason"
              value={revokeReason}
              onChange={e => {
                setrevokeReason(e.target.value);
              }}
              onFocus={handleFocus}
              fullWidth
            />
          </React.Fragment>
        );
      default:
        break;
    }
  }

  const rowSelection = {
    onChange: handleRowSelection,
    selectedRowKeys: [...selectedStorage]
  };

  const handleChangePermission = x => {
    const data = _.cloneDeep(permissionCheck);
    if (data.has(x.featureUuid)) {
      permissionList.forEach(e => {
        if (e.releationship === x.featureUuid) {
          data.delete(e.featureUuid);
        }
      });
      data.delete(x.featureUuid);
    } else {
      data.add(x.releationship);
      data.add(x.featureUuid);
    }
    setPermissionCheck(data);
  };

  const fullwidth = true;

  return (
    <Dialog
      open={open}
      fullWidth={fullwidth}
      maxWidth="md"
      style={{
        width: '100%',
        height: 'auto'
      }}
    >
      <DialogTitle>Request Info</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={classes.startLine}>
              <TextField
                label="Group Name"
                value={requestGroupName}
                style={{ width: '33%', marginRight: 5 }}
                margin="dense"
                disabled
              />
              <TextField
                label="Request Reason"
                value={requestReason}
                style={{ width: '33%' }}
                margin="dense"
                disabled
              />
            </div>
            <div className={classes.centerLine}>
              <TextField
                label="Request By"
                style={{ width: '33%' }}
                value={requestUsername}
                margin="dense"
                disabled
              />
              <TextField
                label="Status"
                style={{ width: '33%' }}
                value={requestStatusDesc}
                margin="dense"
                disabled
              />
              <TextField
                label="Requestor Group"
                style={{ width: '33%' }}
                value={requestorGroupname}
                margin="dense"
                disabled
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            {false && (
              <Paper elevation={4} className={classes.paper}>
                <div style={{ height: '100%' }}>
                  <MapSketch
                    channelData={[]}
                    getMapInformation={e => {
                      console.log(e);
                    }}
                  />
                </div>
              </Paper>
            )}
          </Grid>
          <Grid item xs={12}>
            {permissionList.map(x => {
              return (
                <FormControlLabel
                  value="end"
                  control={
                    <Checkbox
                      checked={permissionCheck.has(x.featureUuid)}
                      onChange={() => {
                        handleChangePermission(x);
                      }}
                      value={x.featureDesc}
                      inputProps={{
                        'aria-label': 'primary checkbox'
                      }}
                    />
                  }
                  key={x.featureUuid}
                  label={x.featureDesc}
                  labelPlacement="end"
                />
              );
            })}
          </Grid>
          <Grid item xs={12}>
            <Typography color="textSecondary" variant="h6">
              Choose Channels To Share
            </Typography>
            <Typography
              color="error"
              variant="caption"
              style={{ display: errorChannel ? 'none' : 'flex' }}
            >
              Please select channels which you want to share
            </Typography>
            <IVHTable
              handleChooseAll={handleChooseAll}
              rowSelection={rowSelection}
              keyId="channelId"
              columns={columns}
              dataSource={sourceList.items}
            />
            <Pagination
              page={pageNo}
              rowsPerPage={pageSize}
              count={channelList.totalNum || 0}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          </Grid>
          <Grid item xs={12}>
            {renderAction()}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {requestStatusDesc === 'Pending' && (
          <Button
            onClick={() => {
              handleApprove('Approve');
            }}
            color="primary"
          >
            Approve
          </Button>
        )}
        {requestStatusDesc === 'Pending' && (
          <Button
            onClick={() => {
              handleApprove('Reject');
            }}
            color="primary"
          >
            Reject
          </Button>
        )}
        {requestStatusDesc === 'Approved' && (
          <Button
            onClick={() => {
              handleApprove('Revoke');
            }}
            color="primary"
          >
            Revoke
          </Button>
        )}
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RequestInfo;
