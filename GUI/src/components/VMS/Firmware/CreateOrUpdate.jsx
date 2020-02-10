import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FolderOpen from '@material-ui/icons/FolderOpen';
import { Input, TextField, SingleSelect, DialogTitle, Button } from 'components/common';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import _ from 'lodash';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';

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
    textField: {
      width: '100%'
    },
    textFieldLable: {
      color: theme.palette.primary.main,
      width: '100%'
    },
    marginTxt: {
      marginTop: 8,
      marginBottom: 4
    }
  };
});

function CreateOrUpdate(props) {
  const {
    openDialog,
    onClose,
    handleSubmitFile,
    modelList,
    perItemData,
    handleUpdateFirmware
  } = props;
  const classes = useStyles();
  const [formValue, setformValue] = React.useState({
    file: '',
    modelId: '',
    version: '',
    description: ''
  });
  const [errorStatus, setErrorStatus] = React.useState({
    modelId: false,
    file: false,
    version: false,
    description: false
  });

  useEffect(() => {
    if (perItemData)
      setformValue({
        modelId: perItemData.firmwareModelId,
        version: perItemData.firmwareVersion,
        description: perItemData.description
      });
  }, [perItemData]);
  function handleClose() {
    onClose();
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
          inputValue = myResult[key].trim();
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
  function onUpload() {
    const flag = isValid(formValue);
    if (!flag) return;
    if (perItemData) {
      handleUpdateFirmware({ ...formValue, firmwareId: perItemData.firmwareId });
    } else {
      handleSubmitFile({ ...formValue, name: formValue.file.name });
    }
  }

  const fullWidth = true;

  const handleChange = name => event => {
    if (name === 'modelId') {
      setformValue({ ...formValue, [name]: event });
    } else if (name === 'file') {
      setformValue({ ...formValue, [name]: event.target.files[0] });
    } else {
      setformValue({ ...formValue, [name]: event.target.value });
    }
  };

  const handleFocusEvent = prop => () => {
    setErrorStatus({ ...errorStatus, [prop]: false });
  };

  const items =
    modelList &&
    modelList.map(x => {
      return { label: x.name, value: x.id };
    });
  return (
    <div>
      <Dialog
        open={openDialog}
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
        <DialogTitle>{perItemData ? 'Update' : 'Upload'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <div className={classes.marginTxt}>
              <SingleSelect
                label="File Type"
                onSelect={handleChange('modelId')}
                value={formValue.modelId}
                helperText={errorStatus.modelId ? VALIDMSG_NOTNULL : ''}
                error={errorStatus.modelId}
                margin="dense"
                onFocus={handleFocusEvent('modelId')}
                selectOptions={items}
                keyValue
                dataIndex={{
                  key: 'value',
                  value: 'value',
                  name: 'label'
                }}
              />
            </div>
            <div className={classes.formItem}>
              <FormControl fullWidth error={errorStatus.file}>
                <InputLabel>Choose Files</InputLabel>
                <Input
                  placeholder="Choose Files"
                  disabled={!!perItemData}
                  value={
                    _.get(perItemData, 'firmwareName', '') || _.get(formValue, 'file.name', '')
                  }
                  onChange={handleFocusEvent('file')}
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
                  multiple
                  onChange={e => {
                    handleChange('file')(e);
                    handleFocusEvent('file')();
                  }}
                  type="file"
                />
                <FormHelperText style={{ display: errorStatus.file ? 'inline' : 'none' }}>
                  {errorStatus.file ? VALIDMSG_NOTNULL : ''}
                </FormHelperText>
              </FormControl>
              {/* </Upload> */}
            </div>
            <TextField
              id="standard-number"
              value={formValue.version}
              onChange={e => {
                handleChange('version')(e);
                handleFocusEvent('version')();
              }}
              className={classes.textField}
              margin="dense"
              multiline
              label="Firmware version"
              placeholder="Firmware version"
              helperText={errorStatus.version ? VALIDMSG_NOTNULL : ''}
              error={errorStatus.version}
            />
            <TextField
              id="standard-number"
              value={formValue.description}
              onChange={e => {
                handleChange('description')(e);
                handleFocusEvent('description')();
              }}
              className={classes.textField}
              margin="dense"
              multiline
              label="Comment"
              placeholder="Comment"
              helperText={errorStatus.description ? VALIDMSG_NOTNULL : ''}
              error={errorStatus.description}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onUpload} color="primary">
            Save
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateOrUpdate;
