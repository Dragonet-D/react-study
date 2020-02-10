import React, { useState, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import _ from 'lodash';
import { ToolTip, SingleSelect, Button, DialogTitle } from 'components/common';
import PropTypes from 'prop-types';
import { I18n, Translate } from 'react-i18nify';
import msg from 'utils/messageCenter';
import * as constant from 'commons/constants/commonConstant';
import FileUpload from '../FileUpload';

const useStyles = makeStyles(() => {
  return {
    dialog: {
      width: '600px',
      maxWidth: '600px'
    }
  };
});

function AlarmHistoryDialog(props) {
  const {
    open,
    handleClose,
    dataSource,
    actionData,
    actionType,
    handleSubmit,
    userId,
    onDownload
  } = props;
  const { alarmType, data, status, note, action, alarmDetailsUuid } = dataSource;
  const classes = useStyles();
  const [actionValue, setActionValue] = useState('');
  const [uploadFileName, setUploadFileName] = useState(action);
  const [uploadFileData, setUploadFileData] = useState(action);
  const [commentsState, setCommentsState] = useState(note || '');
  const [selectErrorStatus, setSelectErrorStatus] = useState(false);
  const [uploadErrorStatus, setUploadErrorStatus] = useState(false);

  const isAction = actionType === 'Action';
  const isView = actionType === 'View';

  useEffect(() => {
    setUploadFileName(action);
    setCommentsState(note);
    setUploadFileData('');
  }, [action, dataSource, note]);

  function handleActionSelect(e) {
    setActionValue(e);
    setSelectErrorStatus(false);
  }

  function handleSave() {
    if (status !== 'Closed' && !actionValue && !_.isEmpty(actionData)) {
      setSelectErrorStatus(true);
      return;
    }
    if (
      status === 'Closed' &&
      (_.isEqual(commentsState, note) && _.isEqual(uploadFileName, action))
    ) {
      msg.warn(constant.VALIDMSG_NOTCHANGE, 'Alarm History');
    } else {
      const fileData = uploadFileData ? { file: uploadFileData } : {};
      const fileName = action ? { fileName: uploadFileName } : {};
      handleSubmit(
        Object.assign(
          {
            alarmDetailsUuid,
            eventType: alarmType,
            status: actionValue || 'Closed',
            userId,
            comments: commentsState || ''
          },
          fileData,
          fileName
        )
      );
    }
  }

  function handleUploadChange(e) {
    const { name, size } = e.file;
    setUploadErrorStatus(size / 1024 / 1000 > 5);
    setUploadFileName(name);
    setUploadFileData(e.file);
  }

  function handleComments(e) {
    const { value } = e.target;
    setCommentsState(value);
  }

  function handleDownload() {
    onDownload(alarmDetailsUuid);
  }

  function clearUploadFile() {
    setUploadFileName('');
    setUploadFileData('');
  }
  return (
    <>
      <Dialog open={open} maxWidth="sm" classes={{ paperWidthSm: classes.dialog }}>
        <DialogTitle>
          <Translate value="alarm.history.alarmDetails" />
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth disabled>
            <InputLabel htmlFor="alarm_history_alarm_type">
              <Translate value="alarm.history.alarmType" />
            </InputLabel>
            <Input id="alarm_history_alarm_type" value={alarmType} />
          </FormControl>
          <ToolTip title={_.isString(data) ? data : JSON.stringify(data)}>
            <FormControl fullWidth disabled>
              <InputLabel htmlFor="alarm_history_data">
                <Translate value="alarm.history.data" />
              </InputLabel>
              <Input
                id="alarm_history_data"
                value={_.isString(data) ? data : JSON.stringify(data) || ''}
              />
            </FormControl>
          </ToolTip>
          {isAction && (
            <>
              <FileUpload
                uploadErrorStatus={uploadErrorStatus}
                uploadFileName={uploadFileName}
                clearUploadFile={clearUploadFile}
                handleUploadChange={handleUploadChange}
              />
            </>
          )}
          {isView && (
            <FormControl fullWidth disabled>
              <InputLabel htmlFor="alarm_history_file_name">File Name</InputLabel>
              <Input id="alarm_history_file_name" value={action || ''} />
            </FormControl>
          )}
          <FormControl fullWidth disabled>
            <InputLabel htmlFor="alarm_history_current_action">Current Action</InputLabel>
            <Input id="alarm_history_current_action" value={status || ''} />
          </FormControl>
          {!_.isEmpty(actionData) && isAction && (
            <SingleSelect
              label="Action*"
              selectOptions={actionData}
              onSelect={handleActionSelect}
              value={actionValue}
              error={selectErrorStatus}
              errorMessage={I18n.t('alarm.remindInformation.SELECT_ERROR')}
            />
          )}
          <FormControl fullWidth disabled={!isAction}>
            <InputLabel htmlFor="alarm_history_comments">
              <Translate value="alarm.history.comments" />
            </InputLabel>
            <Input
              id="alarm_history_comments"
              value={commentsState || ''}
              onChange={handleComments}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownload} color="primary" disabled={!action}>
            <Translate value="alarm.history.download" />
          </Button>
          {isAction && (
            <Button onClick={handleSave} color="primary">
              {I18n.t('global.button.save')}
            </Button>
          )}
          <Button onClick={() => handleClose()} color="primary">
            {I18n.t('global.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AlarmHistoryDialog.defaultProps = {
  open: false,
  handleClose: () => {},
  dataSource: {},
  actionData: [],
  handleSubmit: () => {},
  onDownload: () => {}
};

AlarmHistoryDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  dataSource: PropTypes.object,
  actionData: PropTypes.array,
  handleSubmit: PropTypes.func,
  onDownload: PropTypes.func
};

export default AlarmHistoryDialog;
