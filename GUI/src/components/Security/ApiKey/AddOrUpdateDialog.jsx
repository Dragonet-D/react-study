import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import _ from 'lodash';
import DialogContentText from '@material-ui/core/DialogContentText';
import { I18n } from 'react-i18nify';
import { VALIDMSG_NOTNULL, VALIDMSG_NOTCHANGE } from 'commons/constants/commonConstant';
import { TextField, Button, SingleSelect, DatePicker } from 'components/common';
import msg from 'utils/messageCenter';
import { DATE_FORMAT_DATE_PICKER, DATE_FORMAT } from 'commons/constants/const';
import moment from 'moment';

const useStyles = makeStyles(theme => {
  return {
    dialogTitle: {
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`
    },
    dateTimePicker: {
      width: '230px',
      float: 'left',
      marginLeft: theme.spacing(1)
    },
    textField: {
      width: '100%'
    },
    buttonGroup: {
      height: '100%',
      width: '20%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  };
});

function AddOrUpdateDialog(props) {
  const { onClose, handleSubmit, itemData } = props;
  const classes = useStyles();
  // const [mode, setmode] = React.useState();
  const initialForm = {
    userEmail: '',
    userFullName: '',
    userId: '',
    userPhone: '',
    startDate: new Date(),
    targetSystem: '',
    validTime: '',
    expiredDate: ''
  };
  const [formValue, setformValue] = React.useState({
    ...initialForm
  });
  const [errorStatus, setErrorStatus] = React.useState({
    userEmail: false,
    userFullName: false,
    userId: false,
    userPhone: false,
    startDate: false,
    targetSystem: false,
    validTime: false
  });

  React.useEffect(() => {
    if (itemData) {
      itemData.startDate = moment(itemData.startDate, 'DD/MM/YYYY HH:mm:ss').format();
      setformValue({
        ...itemData
      });
    }
  }, [itemData]);

  function handleClose() {
    onClose();
  }

  function isValid(myResult) {
    let flag = true;
    const obj = _.cloneDeep(errorStatus);
    for (const key in myResult) {
      if (key !== 'startDate') {
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
        if (formValue.startDate) {
          const ft = new Date(formValue.startDate).getTime();
          formValue.startDate = ft;
        }
        msg.warn(VALIDMSG_NOTCHANGE, 'Api Key');
        return;
      }
    }
    if (formValue.startDate) {
      const ft = new Date(formValue.startDate).getTime();
      formValue.startDate = ft;
    }
    handleSubmit(formValue);
  }

  const TRUE = true;

  const handleChange = name => event => {
    setErrorStatus({ ...errorStatus, [name]: false });
    if (name === 'targetSystem' || name === 'startDate') {
      setformValue({ ...formValue, [name]: event });
    } else if (name === 'validTime') {
      const val = event.target.value;
      if (parseInt(val, 0) >= 0 || val === '') {
        setformValue({ ...formValue, [name]: val });
        if (val && formValue.startDate !== '') {
          setformValue({
            ...formValue,
            [name]: val,
            expiredDate: moment(
              new Date(val * 30 * 24 * 1000 + new Date(formValue.startDate).getTime())
            ).format(DATE_FORMAT)
          });
        }
      }
    } else {
      setformValue({ ...formValue, [name]: event.target.value });
    }
  };
  return (
    <div>
      <Dialog open fullWidth={TRUE} maxWidth="xs">
        <Typography
          color="textSecondary"
          className={classes.dialogTitle}
          component="h6"
          variant="h6"
        >
          {itemData
            ? I18n.t('security.apiKey.updateApiKey')
            : I18n.t('security.apiKey.createApiKey')}
        </Typography>
        <DialogContent>
          <DialogContentText component="div">
            <TextField
              fullWidth
              label={I18n.t('security.apiKey.userId')}
              placeholder={I18n.t('security.apiKey.userId')}
              onChange={handleChange('userId')}
              value={formValue.userId}
              required={TRUE}
              helperText={errorStatus.userId ? VALIDMSG_NOTNULL : ''}
              error={errorStatus.userId}
              margin="dense"
            />
            <TextField
              fullWidth
              label={I18n.t('security.apiKey.userFullName')}
              placeholder={I18n.t('security.apiKey.userFullName')}
              onChange={handleChange('userFullName')}
              value={formValue.userFullName || ''}
              required={TRUE}
              helperText={errorStatus.userFullName ? VALIDMSG_NOTNULL : ''}
              error={errorStatus.userFullName}
              margin="dense"
            />
            <TextField
              fullWidth
              label={I18n.t('security.apiKey.userEmail')}
              placeholder={I18n.t('security.apiKey.userEmail')}
              onChange={handleChange('userEmail')}
              value={formValue.userEmail || ''}
              required={TRUE}
              helperText={errorStatus.userEmail ? VALIDMSG_NOTNULL : ''}
              error={errorStatus.userEmail}
              margin="dense"
            />
            <TextField
              fullWidth
              label={I18n.t('security.apiKey.userPhone')}
              placeholder={I18n.t('security.apiKey.userPhone')}
              onChange={handleChange('userPhone')}
              value={formValue.userPhone || ''}
              required={TRUE}
              helperText={errorStatus.userPhone ? VALIDMSG_NOTNULL : ''}
              error={errorStatus.userPhone}
              margin="dense"
            />
            <SingleSelect
              label={I18n.t('security.apiKey.targetSystem')}
              onSelect={handleChange('targetSystem')}
              selectOptions={['UMMI', 'UVAP', 'UVMS']}
              value={formValue.targetSystem}
              error={errorStatus.targetSystem}
              errorMessage={VALIDMSG_NOTNULL}
            />
            <TextField
              fullWidth
              label={I18n.t('security.apiKey.validTime')}
              placeholder={I18n.t('security.apiKey.validTime')}
              onChange={handleChange('validTime')}
              value={formValue.validTime}
              required={TRUE}
              helperText={errorStatus.validTime ? VALIDMSG_NOTNULL : ''}
              error={errorStatus.validTime}
              margin="dense"
            />
            <DatePicker
              label={I18n.t('security.apiKey.startDate')}
              value={formValue.startDate || ''}
              // value={new Date()}
              handleChange={handleChange('startDate')}
              clearable
              // disablePast
              format={DATE_FORMAT_DATE_PICKER}
              // onAccept={handleDateSubmit('startTime')}
            />
            {itemData && (
              <TextField
                disabled
                fullWidth
                label={I18n.t('security.apiKey.expiredDate')}
                placeholder={I18n.t('security.apiKey.expiredDate')}
                value={formValue.expiredDate}
                required={TRUE}
                margin="dense"
              />
            )}
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

export default AddOrUpdateDialog;
