import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, SingleSelect } from 'components/common';
import { VapDialog, VapUpload } from 'components/UVAP';
import { I18n } from 'react-i18nify';
import { FILE_MAX_LENGTH } from 'components/UVAP/util';
import { VAP_COMMON } from 'commons/constants/commonConstant';

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

const validationAction = (data, action) => {
  switch (action.type) {
    case 'reset':
      return { incidentName: false, incidentType: false, incidentFile: false };
    case 'incidentName':
      return { ...data, incidentName: action.data };
    case 'incidentType':
      return { ...data, incidentType: action.data };
    case 'incidentFile':
      return { ...data, incidentFile: action.data };
    default:
      return { ...data };
  }
};
function PostIncidentCreateDialog(props) {
  const classes = useStyles();
  const { loading, onClose, onSave, open } = props;
  const dialogTitle = I18n.t('vap.dialog.incident.createTitle');

  const [validation, dispatchValidation] = useReducer(validationAction, {
    incidentName: false,
    incidentType: false,
    incidentFile: false
  });
  const newDataActions = (data, action) => {
    if (action.type !== '' && !_.isNil(action.data) && action.data !== '') {
      dispatchValidation({ type: action.type, data: false });
    }
    switch (action.type) {
      case '':
        return { ...action.data };
      case 'incidentName':
        return { ...data, incidentName: action.data };
      case 'incidentType':
        return { ...data, incidentType: action.data };
      case 'incidentFile':
        return { ...data, incidentFile: action.data };
      case 'file':
        return { ...data, file: action.data };
      case 'incidentDescription':
        return { ...data, incidentDescription: action.data };
      default:
        throw new Error();
    }
  };

  const [newData, dispatchNewData] = useReducer(newDataActions, {});
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');
  // init func
  function handleChangeFile(obj) {
    if (obj !== '') {
      if (obj.file.size / 1024 / 1000 > FILE_MAX_LENGTH) {
        dispatchValidation({ type: 'incidentFile', data: true });
        setUploadErrorMsg(`${I18n.t('vap.dialog.files.uploadMaxError')}${FILE_MAX_LENGTH}MB`);
      } else {
        setUploadErrorMsg('');
        dispatchValidation({ type: 'incidentFile', data: false });
        dispatchNewData({ type: 'incidentFile', data: obj.file.name });
        dispatchNewData({ type: 'file', data: obj.file });
      }
    } else {
      setUploadErrorMsg('');
      dispatchValidation({ type: 'incidentFile', data: false });
      dispatchNewData({ type: 'incidentFile', data: '' });
      dispatchNewData({ type: 'file', data: null });
    }
  }

  function handleSave() {
    let validateIsOk = true;
    if (_.isNil(newData.incidentName) || newData.incidentName === '') {
      dispatchValidation({ type: 'incidentName', data: true });
      validateIsOk = false;
    }
    if (_.isNil(newData.incidentFile) || newData.incidentFile === '') {
      dispatchValidation({ type: 'incidentFile', data: true });
      validateIsOk = false;
    }
    if (_.isNil(newData.incidentType) || newData.incidentType === '') {
      dispatchValidation({ type: 'incidentType', data: true });
      validateIsOk = false;
    }

    if (validateIsOk) {
      onSave(newData);
    } else {
      return false;
    }
  }

  function handleClose() {
    onClose();
  }

  return (
    <VapDialog
      open={open}
      title={dialogTitle}
      loading={loading}
      handleSave={handleSave}
      handleClose={handleClose}
      dialogWidth={classes.dialog}
    >
      <TextField
        label={I18n.t('vap.dialog.incident.name')}
        placeholder={I18n.t('vap.dialog.common.namePlaceholder')}
        value={newData.incidentName || ''}
        onChange={e => dispatchNewData({ type: 'incidentName', data: e.target.value })}
        fullWidth
        helperText={validation.incidentName ? I18n.t('vap.dialog.incident.nameErrorMsg') : ''}
        error={validation.incidentName}
        required
      />
      <div className={classes.margin}>
        <SingleSelect
          label={I18n.t('vap.dialog.incident.type')}
          selectOptions={VAP_COMMON.incidentType}
          onSelect={val => dispatchNewData({ type: 'incidentType', data: val })}
          value={newData.incidentType || ''}
          error={validation.incidentType}
          errorMessage={validation.incidentType ? I18n.t('vap.dialog.incident.typeErrorMsg') : ''}
          fullWidth
          required
        />
      </div>
      <div className={classes.margin}>
        <VapUpload
          handleUploadChange={obj => handleChangeFile(obj)}
          uploadFileName={newData.incidentFile || ''}
          clearUploadFile={() => handleChangeFile('')}
          uploadErrorStatus={validation.incidentFile}
          uploadErrorMsg={
            validation.incidentFile
              ? uploadErrorMsg || I18n.t('vap.dialog.incident.fileErrorMsg')
              : ''
          }
          required
          fullWidth
        />
      </div>

      <div className={classes.margin}>
        <TextField
          label={I18n.t('vap.dialog.incident.comment')}
          placeholder={I18n.t('vap.dialog.incident.commentPlaceholder')}
          value={newData.incidentDescription || ''}
          onChange={e => dispatchNewData({ type: 'incidentDescription', data: e.target.value })}
          fullWidth
        />
      </div>
    </VapDialog>
  );
}

PostIncidentCreateDialog.defaultProps = {
  open: false,
  onClose: () => {},
  onSave: () => {}
};

PostIncidentCreateDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func
};

export default PostIncidentCreateDialog;
