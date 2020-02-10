import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { SingleSelect } from 'components/common';
import { VapDialog, VapUpload } from 'components/UVAP';
import { I18n } from 'react-i18nify';
import { FILE_MAX_LENGTH } from 'components/UVAP/util';

const useStyles = makeStyles(theme => {
  return {
    dialog: {
      width: '600px',
      maxWidth: '600px'
    },
    margin: {
      marginTop: theme.spacing(2)
    }
  };
});

function LicenseCreateDialog(props) {
  const classes = useStyles();
  const { loading, onClose, onSave, open, enginesList } = props;
  const dialogTitle = I18n.t('vap.dialog.license.createTitle');
  const [appId, setAppId] = useState('');
  const [file, setFile] = useState({});
  const [fileName, setFileName] = useState('');
  const [validation, dispatchValidation] = useReducer(validateAction, {
    appId: false,
    file: false
  });
  const [overSizeMsg, setOverSizeMsg] = useState('');
  function validateAction(info, action) {
    switch (action.type) {
      case 'reset':
        return { appId: false, file: false };
      case 'appId':
        return { ...info, appId: action.data };
      case 'file':
        return { ...info, file: action.data };
      default:
        throw new Error();
    }
  }
  // init func
  function handleSelectedFile(value) {
    if (_.isEmpty(value)) {
      dispatchValidation({ type: 'file', data: true });
      return false;
    }
    if (value.file.size / 1024 / 1000 > FILE_MAX_LENGTH) {
      dispatchValidation({ type: 'file', data: true });
      setOverSizeMsg(`${I18n.t('vap.dialog.files.uploadMaxError')}${FILE_MAX_LENGTH}MB`);
      return false;
    }
    setFile(value.file);
    setFileName(value.file.name);
    dispatchValidation({ type: 'file', data: false });
  }
  function handleClearFile() {
    setFile({});
    setFileName('');
  }

  function handleSave() {
    if (_.isNil(appId) || appId === '') {
      dispatchValidation({ type: 'appId', data: true });
    } else {
      dispatchValidation({ type: 'appId', data: false });
    }
    if (_.isNil(fileName) || _.isEmpty(file) || fileName === '') {
      dispatchValidation({ type: 'file', data: true });
    } else {
      dispatchValidation({ type: 'file', data: false });
    }
    if (_.isNil(appId) || appId === '' || _.isNil(fileName) || _.isEmpty(file) || fileName === '') {
      return false;
    }
    onSave({ id: appId, file });
  }

  function handleClose() {
    onClose();
  }

  useEffect(() => {
    if (!_.isNil(appId) && appId !== '') {
      dispatchValidation({ type: 'appId', data: false });
    }
  }, [appId]);
  return (
    <VapDialog
      open={open}
      title={dialogTitle}
      loading={loading}
      handleSave={handleSave}
      handleClose={handleClose}
      dialogWidth={classes.dialog}
    >
      <SingleSelect
        label={I18n.t('vap.dialog.license.engineName')}
        selectOptions={enginesList}
        onSelect={setAppId}
        value={appId || ''}
        fullWidth
        required
        keyValue
        dataIndex={{ name: 'name', value: 'id', key: 'id' }}
        error={validation.appId}
        errorMessage={validation.appId ? I18n.t('vap.dialog.license.engineNameErrorMsg') : ''}
      />
      <div className={classes.margin}>
        <VapUpload
          handleUploadChange={obj => handleSelectedFile(obj)}
          uploadFileName={fileName || ''}
          clearUploadFile={handleClearFile}
          uploadErrorStatus={validation.file}
          uploadErrorMsg={
            validation.file ? overSizeMsg || I18n.t('vap.dialog.common.uploadErrorMsg') : ''
          }
        />
      </div>
    </VapDialog>
  );
}

LicenseCreateDialog.defaultProps = {
  open: false,
  onClose: () => {},
  onSave: () => {},
  enginesList: []
};

LicenseCreateDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  enginesList: PropTypes.array
};

export default LicenseCreateDialog;
