import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FolderOpen from '@material-ui/icons/FolderOpen';
import { Input, Button, DialogTitle, TextField, SingleSelect, DatePicker } from 'components/common';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import { VALIDMSG_NOTNULL, VAP_COMMON } from 'commons/constants/commonConstant';
import { I18n } from 'react-i18nify';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { DATE_FORMAT } from 'commons/constants/const';

// const useStyles = makeStyles(() => {
//   return {};
// });
function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange(values.floatValue);
      }}
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

function UploadDialog(props) {
  const { closeDialog, openDialog, itemData, handleSubmit } = props;
  // const classes = useStyles();
  const [file, setfile] = React.useState('');
  const [errState, setErrState] = React.useState(false);
  const [keyType, setKeyType] = React.useState('');
  const [keyTypeError, setKeyTypeError] = React.useState(false);
  const [expiry, setExpiry] = React.useState(new Date().getTime());
  const [currentDate] = React.useState(new Date().getTime());
  // const [expiryError, setExpiryError] = React.useState(false);
  const [vaInstanceLimit, setVaInstanceLimit] = React.useState('');
  const [vaInstanceLimitError, setVaInstanceLimitError] = React.useState(false);
  const [keyError, setKeyError] = React.useState(false);
  const [key, setKey] = React.useState('');
  function handleClose() {
    closeDialog();
  }

  const handleUploadChange = e => {
    const { files } = e.target;
    setfile(files[0]);
  };

  function handleSetKeyType(val) {
    if (_.isNil(val) || val === '') {
      setKeyTypeError(true);
    } else {
      setKeyTypeError(false);
    }
    if (keyType === 'NONE') {
      setErrState(false);
      setKeyError(false);
      setKey('');
      setfile({});
    } else if (keyType === 'STRING') {
      setErrState(false);
      setfile({});
    } else if (keyType === 'FILE') {
      setKeyError(false);
      setKey('');
    }
    setKeyType(val);
  }

  // function handleSetExpiry(val) {
  //   if (_.isNil(val) || val === '') {
  //     setExpiryError(true);
  //   } else {
  //     setExpiryError(false);
  //   }
  //   setExpiry(val);
  // }

  function handleSetVaInstanceLimit(val) {
    if (_.isNil(val) || val === '') {
      setVaInstanceLimitError(true);
    } else {
      setVaInstanceLimitError(false);
    }
    setVaInstanceLimit(val);
  }

  function handleSetKey(e) {
    if (_.isNil(e.target.value) || e.target.value === '') {
      setKeyError(true);
    } else {
      setKeyError(false);
    }
    setKey(e.target.value);
  }

  const save = () => {
    let isOK = true;
    if (!keyType) {
      setKeyTypeError(true);
      isOK = false;
    } else if (keyType === 'FILE') {
      if (!file) {
        setErrState(true);
        isOK = false;
      }
    } else if (keyType === 'STRING') {
      if (_.isNil(key) || key === '') {
        setKeyError(true);
        isOK = false;
      }
    }

    // if (_.isNil(expiry) || expiry === '') {
    //   setExpiryError(true);
    //   isOK = false;
    // }
    if (_.isNil(vaInstanceLimit) || vaInstanceLimit === '') {
      setVaInstanceLimitError(true);
      isOK = false;
    }
    const obj = {
      appId: itemData.appId,
      keyType,
      key,
      expiry,
      vaInstanceLimit,
      restrictions: {}
    };
    if (isOK) handleSubmit(obj);
  };

  return (
    <Dialog open={openDialog} maxWidth="sm">
      <DialogTitle>{I18n.t('overview.title.uploadLicense')}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <TextField
            disabled
            label={I18n.t('overview.title.vaEngineName')}
            placeholder={I18n.t('overview.title.vaEngineName')}
            inputProps={{ maxLength: '50' }}
            value={!itemData.appName ? '' : itemData.appName}
            margin="dense"
          />
          <SingleSelect
            label={I18n.t('overview.title.keyTypeName')}
            selectOptions={VAP_COMMON.keyType}
            onSelect={val => handleSetKeyType(val)}
            value={keyType || ''}
            error={keyTypeError}
            errorMessage={keyTypeError ? VALIDMSG_NOTNULL : ''}
            required
            margin="dense"
          />
          {keyType === 'FILE' && (
            <FormControl error={errState} fullWidth margin="dense">
              <InputLabel>{I18n.t('global.lable.chooseFiles')}</InputLabel>
              <Input
                placeholder={I18n.t('global.lable.chooseFiles')}
                value={!file ? '' : file.name}
                onClick={() => {
                  setErrState(false);
                }}
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
                onChange={handleUploadChange}
                type="file"
              />
              {errState && <FormHelperText>{VALIDMSG_NOTNULL}</FormHelperText>}
            </FormControl>
          )}

          {keyType === 'STRING' && (
            <TextField
              label={I18n.t('overview.title.keyName')}
              placeholder={I18n.t('overview.title.keyName')}
              value={key}
              onChange={handleSetKey}
              // margin="dense"
              // inputProps={{ maxLength: '50' }}
              error={keyError}
              errorMessage={keyError ? VALIDMSG_NOTNULL : ''}
              required
              margin="dense"
            />
          )}

          <DatePicker
            label={I18n.t('overview.title.expiryName')}
            format={DATE_FORMAT}
            minDate={currentDate}
            value={expiry}
            handleChange={moment => setExpiry(moment.valueOf())}
            margin="dense"
          />

          <TextField
            label={I18n.t('overview.title.vaInstanceLimitName')}
            placeholder={I18n.t('overview.title.vaInstanceLimitName')}
            value={vaInstanceLimit}
            onChange={handleSetVaInstanceLimit}
            // margin="dense"
            inputProps={{ maxLength: '50' }}
            error={vaInstanceLimitError}
            errorMessage={vaInstanceLimitError ? VALIDMSG_NOTNULL : ''}
            required
            InputProps={{
              inputComponent: NumberFormatCustom
            }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={save} color="primary">
          {I18n.t('global.button.save')}
        </Button>
        <Button onClick={handleClose} color="primary">
          {I18n.t('global.button.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UploadDialog;
