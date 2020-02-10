import React, { memo, useState, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AlarmDialog from '../AlarmDialog';
import { SingleSelect, TextField, Button } from '../../common';
import FileUpload from '../FileUpload';

const useStyles = makeStyles(() => {
  return {
    dialog_size: {
      maxWidth: 500,
      width: 500,
      maxHeight: 400,
      height: 400
    }
  };
});

const ActionForAlarmRealTimeVap = memo(props => {
  const classes = useStyles();
  const { open, dataSource, actionData, onDownload, userId, handleSubmit, ...reset } = props;

  const [status, setStatus] = useState('');
  const [comments, setComments] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileData, setUploadFileData] = useState('');
  const [uploadErrorStatus, setUploadErrorStatus] = useState(false);

  useEffect(() => {
    setComments(dataSource.note || '');
    setUploadFileName(dataSource.action || '');
  }, [dataSource]);

  function handleStatusSelect(e) {
    setStatus(e);
  }

  function handleCommentsChange(e) {
    const { value } = e.target;
    setComments(value);
  }

  function handleUploadChange(e) {
    const { name, size } = e.file;
    setUploadErrorStatus(size / 1024 / 1000 > 5);
    setUploadFileName(name);
    setUploadFileData(e.file);
  }

  function handleSave() {
    handleSubmit({
      comments,
      status,
      userId,
      file: uploadFileData,
      eventType: dataSource.alarmType,
      alarmDetailsUuid: dataSource.alarmDetailsUuid
    });
  }

  function clearUploadFile() {
    setUploadFileData('');
  }
  return (
    <AlarmDialog
      open={open}
      title="Actions"
      dialogWidth={classes.dialog_size}
      handleSave={handleSave}
      action={
        <Button
          onClick={() => onDownload(dataSource.alarmDetailsUuid)}
          disabled={!dataSource.action}
        >
          Download
        </Button>
      }
      {...reset}
    >
      <SingleSelect
        label="Status"
        value={status}
        onSelect={handleStatusSelect}
        selectOptions={actionData}
      />
      <TextField label="Comments" fullWidth value={comments} onChange={handleCommentsChange} />
      <FileUpload
        uploadErrorStatus={uploadErrorStatus}
        uploadFileName={uploadFileName}
        clearUploadFile={clearUploadFile}
        handleUploadChange={handleUploadChange}
      />
    </AlarmDialog>
  );
});

export default ActionForAlarmRealTimeVap;
