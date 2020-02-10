import React from 'react';
// import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import _ from 'lodash';
import DialogContentText from '@material-ui/core/DialogContentText';
import { I18n } from 'react-i18nify';
import { VALIDMSG_NOTNULL, VALIDMSG_NOTCHANGE } from 'commons/constants/commonConstant';
import { TextField, Button, DialogTitle, SingleSelect } from 'components/common';
import msg from 'utils/messageCenter';

// const useStyles = makeStyles(theme => {
//   return {
//     dialogTitle: {
//       padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`
//     },
//     dateTimePicker: {
//       width: '230px',
//       float: 'left',
//       marginLeft: theme.spacing(1)
//     },
//     textField: {
//       width: '100%'
//     },
//     // formItem: {
//     //   width: '100%',
//     //   height: '100px',
//     //   display: 'flex',
//     //   alignItems: 'center'
//     // },
//     buttonGroup: {
//       height: '100%',
//       width: '20%',
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center'
//     }
//   };
// });

function AddDevice(props) {
  const { openDialog, onClose, infoSave, itemData, modelList } = props;
  // const classes = useStyles();
  // const [open, setOpen] = React.useState(false);
  const [mode, setmode] = React.useState();
  const [formValue, setformValue] = React.useState({
    name: '',
    uri: '',
    username: '',
    password: '',
    model: ''
  });
  const [errorStatus, setErrorStatus] = React.useState({
    name: false,
    uri: false,
    username: false,
    password: false,
    model: false
  });

  let modelSelection = [];
  if (modelList) {
    modelSelection = modelList.map(x => {
      return { key: x.id, value: x.id, name: x.name };
    });
  }

  React.useEffect(() => {
    if (itemData) {
      const { deviceName, deviceUri, modelId } = itemData;
      const uri = deviceUri;
      const name = deviceName;
      const model = modelId;
      setformValue({
        name,
        uri,
        model,
        username: '',
        password: ''
      });
      setmode('update');
    } else {
      setformValue({
        name: '',
        uri: '',
        username: '',
        password: '',
        model: ''
      });
      setmode('add');
    }
  }, [itemData]);

  // function handleClickOpen() {
  // setOpen(true);
  // }

  function handleClose() {
    // setOpen(false);
    onClose();
  }

  function isValid(myResult) {
    let flag = true;
    const obj = _.cloneDeep(errorStatus);
    if (myResult.model === 'virtual') {
      for (const key in myResult) {
        const inputValue = myResult[key] && myResult[key].trim();
        if (key === 'name' && inputValue === '') {
          flag = false;
          obj.name = true;
        } else if (key === 'name' && inputValue !== '') {
          obj.name = false;
        }
      }
    } else {
      for (const key in myResult) {
        const inputValue = myResult[key].trim();
        if (inputValue === '') {
          flag = false;
          obj[key] = true;
        }
      }
    }
    setErrorStatus(obj);
    return flag;
  }

  function onSave() {
    const flag = isValid(formValue);
    if (!flag) return;
    if (itemData) {
      if (_.isEqual(itemData, formValue)) {
        msg.warn(VALIDMSG_NOTCHANGE, 'Video Device');
        return;
      }
    }
    infoSave({ payload: formValue, type: mode, itemData });
  }

  const TRUE = true;

  const handleChange = prop => event => {
    if (prop === 'model') {
      setformValue({ ...formValue, [prop]: event });
    } else {
      setformValue({ ...formValue, [prop]: event.target.value });
    }
    setErrorStatus({ ...errorStatus, [prop]: false });
  };

  return (
    <div>
      <Dialog open={openDialog} fullWidth={TRUE} maxWidth="xs">
        <DialogTitle>{itemData ? 'Update Device' : 'Add Device'}</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <TextField
              fullWidth
              label={I18n.t('uvms.videoDevice.deviceName')}
              placeholder={I18n.t('uvms.videoDevice.deviceName')}
              onChange={handleChange('name')}
              value={formValue.name}
              required={TRUE}
              helperText={errorStatus.name ? VALIDMSG_NOTNULL : ''}
              error={errorStatus.name}
              margin="dense"
            />
            {/* </div>
            <div className={classes.formItem} style={{ paddingLeft: '8px' }}> */}
            <TextField
              fullWidth
              label={I18n.t('uvms.videoDevice.uri')}
              placeholder={I18n.t('uvms.videoDevice.uri')}
              onChange={handleChange('uri')}
              value={formValue.uri || ''}
              required={formValue.model !== 'virtual' && TRUE}
              helperText={errorStatus.uri ? VALIDMSG_NOTNULL : ''}
              error={errorStatus.uri}
              margin="dense"
            />
            <TextField
              fullWidth
              label={I18n.t('uvms.videoDevice.userName')}
              placeholder={I18n.t('uvms.videoDevice.userName')}
              onChange={handleChange('username')}
              value={formValue.username}
              required={formValue.model !== 'virtual' && TRUE}
              helperText={errorStatus.username ? VALIDMSG_NOTNULL : ''}
              error={errorStatus.username}
              margin="dense"
              autoComplete="off"
            />
            <TextField
              fullWidth
              label={I18n.t('uvms.videoDevice.password')}
              placeholder={I18n.t('uvms.videoDevice.password')}
              onChange={handleChange('password')}
              type="password"
              value={formValue.password}
              required={formValue.model !== 'virtual' && TRUE}
              helperText={errorStatus.password ? VALIDMSG_NOTNULL : ''}
              error={errorStatus.password}
              margin="dense"
              autoComplete="off"
            />
            {/* </div> handleChange('model')
            <div className={classes.formItem} style={{ paddingLeft: '8px' }}> */}
            <SingleSelect
              fullWidth
              label={I18n.t('uvms.videoDevice.model')}
              onSelect={handleChange('model')}
              dataIndex={{ name: 'name', key: 'key', value: 'value' }}
              selectOptions={modelSelection}
              value={formValue.model}
              required={TRUE}
              errorMessage={errorStatus.model ? VALIDMSG_NOTNULL : ''}
              error={errorStatus.model}
              margin="dense"
              keyValue
            />
            {/* <TextField
              fullWidth
              value={formValue.model}
              label={I18n.t('uvms.videoDevice.model')}
              onChange={handleChange('model')}
              select
              required={TRUE}
              helperText={errorStatus.model ? VALIDMSG_NOTNULL : ''}
              error={errorStatus.model}
              margin="dense"
            >
              {modelSelection &&
                modelSelection.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </TextField> */}
            {/* </div> */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onSave} color="primary">
            {I18n.t('global.button.save')}
          </Button>
          <Button onClick={handleClose} color="primary">
            {I18n.t('global.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddDevice;
