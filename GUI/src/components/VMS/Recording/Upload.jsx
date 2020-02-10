import React from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
// import InputAdornment from '@material-ui/core/InputAdornment';
import FolderOpen from '@material-ui/icons/FolderOpen';
import moment from 'moment';
import { I18n } from 'react-i18nify';
import { DatePicker, Input, DialogTitle } from 'components/common';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
// import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import { DATE_FORMAT_DATE_PICKER } from 'commons/constants/const';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';
import _ from 'lodash';
import './Recording.module.less';

const useStyles = makeStyles(() => {
  return {
    dateTimePicker: {
      width: '100%'
    },
    textField: {
      width: '100%'
    }
  };
});

function FileUpload(props) {
  const { onClose, fileUpload, itemData } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [uploadTime, setuploadTime] = React.useState(moment());
  const [formData, setFormData] = React.useState({
    fileType: 'Video Type(mp4,mov,avi,3gpp,wmv)',
    expireDay: 1,
    file: ''
  });
  const [errorStatus, setErrorStatus] = React.useState({
    fileType: false,
    file: false,
    expireDay: false,
    uploadTime: false
  });
  function handleClickOpen() {
    setOpen(true);
  }
  function isValid(myResult) {
    let flag = true;
    setErrorStatus(prev => {
      const data = _.cloneDeep(prev);
      for (const key in myResult) {
        let inputValue = '';
        if (key === 'file') {
          inputValue = myResult[key];
        } else {
          inputValue = myResult[key] ? myResult[key].trim() : '';
        }
        if (inputValue === '') {
          flag = false;
          data[key] = true;
        }
      }
      return data;
    });
    return flag;
  }
  function handleClose() {
    setOpen(false);
    onClose();
  }

  function onUpload() {
    const obj = {
      file: formData.file,
      recordingName: formData.file.name,
      deviceId: itemData.deviceId,
      channelId: itemData.channelId,
      streamId: itemData.streamInfos[0].streamId || '0',
      type: formData.file.type,
      ttl: (formData.expireDay * 24 * 60 * 60 * 1000).toString(),
      recordingTime: new Date(uploadTime).getTime().toString()
    };
    const flag = isValid(obj);
    if (!flag) return;
    fileUpload(obj);
    // handleClose();
  }

  React.useEffect(() => {
    handleClickOpen();
  }, []);

  const fullWidth = true;

  // const handleChange = event => {
  //   setFormData(event.target.value);
  // };

  const handleChange = name => event => {
    if (name === 'file') {
      setFormData({ ...formData, [name]: event.target.files[0] });
    } else if (name === 'expireDay') {
      if (event.target.value < 1) {
        setFormData({ ...formData, [name]: 1 });
      } else if (event.target.value > 90) {
        setFormData({ ...formData, [name]: 90 });
      } else {
        setFormData({ ...formData, [name]: event.target.value });
      }
    } else {
      setFormData({ ...formData, [name]: event.target.value });
    }
  };

  const items = [
    {
      value: 'Video Type(mp4,mov,avi,3gpp,wmv)',
      label: 'Video Type(mp4,mov,avi,3gpp,wmv)'
    }
  ];

  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth={fullWidth}
        maxWidth="xs"
        style={{
          width: '100%',
          height: 'auto'
        }}
      >
        <DialogTitle>{I18n.t('uvms.recording.fileUpload.upload')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <TextField
              id="standard-select-currency"
              select
              label={I18n.t('uvms.recording.fileUpload.fileType')}
              className={classes.textField}
              value={formData.fileType}
              onChange={handleChange('fileType')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              // helperText="Please select your File Type"
              margin="dense"
            >
              {items.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {/* <Upload
              name="file"
              showUploadList={false}
              action=""
              beforeUpload={() => false}
              onChange={handleUploadChange}
              style={{ width: '100%' }}
            >
              <Input
                // startAdornment={<label style={{ width: '15%' }}>File Name</label>}
                lable="File Name"
                style={{ width: '100%' }}
                value={fileName}
                endAdornment={<FolderOpen className={classes.file_icon} />}
              />
            </Upload> */}
            <FormControl fullWidth error={errorStatus.file}>
              <InputLabel>{I18n.t('uvms.recording.fileUpload.chooseFile')}</InputLabel>
              <Input
                placeholder={I18n.t('uvms.recording.fileUpload.chooseFile')}
                value={formData.file ? formData.file.name : ''}
                // onFocus={handleFocusEvent('file')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="Choose Files">
                      <label htmlFor="contained-button-file">
                        <FolderOpen />
                      </label>
                    </IconButton>
                  </InputAdornment>
                }
              />
              <input
                style={{ display: 'none' }}
                id="contained-button-file"
                onChange={handleChange('file')}
                type="file"
              />
              <FormHelperText style={{ display: errorStatus.file ? 'inline' : 'none' }}>
                {errorStatus.file ? VALIDMSG_NOTNULL : ''}
              </FormHelperText>
            </FormControl>

            <TextField
              fullWidth
              value={formData.expireDay}
              onChange={handleChange('expireDay')}
              type="number"
              className={classes.textField}
              margin="dense"
              style={{ textAlign: 'center' }}
              label={I18n.t('uvms.recording.fileUpload.expireDay')}
            />
            <div className={classes.dateTimePicker}>
              <DatePicker
                date={moment(uploadTime).format('YYYY-MM-DDTHH:mm')}
                label={I18n.t('uvms.recording.fileUpload.uploadTime')}
                format={DATE_FORMAT_DATE_PICKER}
                value={moment(uploadTime).format('YYYY-MM-DDTHH:mm')}
                handleChange={val => setuploadTime(moment(val))}
                className={classes.textField}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onUpload} color="primary">
            {I18n.t('uvms.recording.button.save')}
          </Button>
          <Button onClick={handleClose} color="primary">
            {I18n.t('uvms.recording.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FileUpload;
