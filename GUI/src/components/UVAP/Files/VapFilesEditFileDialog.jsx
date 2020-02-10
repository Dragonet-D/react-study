import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from 'components/common';
import { VapDialog, VapUpload } from 'components/UVAP';
import { I18n } from 'react-i18nify';
import { VapNoChangeInfoMsg, MEDIA_FILE_MAX_LENGTH } from 'components/UVAP/util';
import store from '@/index';
import Resumable from 'libs/resumablejs';
import msg from 'utils/messageCenter';
import token from 'utils/tokenHelper';
import getUrls from 'utils/urls/index';

const urls = getUrls.vap;
let uploadId = '';
let r = null;

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

function VapFilesEditFileDialog(props) {
  const classes = useStyles();
  const { onClose, onSave, fileData, open, editOpenType, userId } = props;
  const dialogTitle =
    editOpenType === 'update'
      ? I18n.t('vap.dialog.files.updateTitle')
      : I18n.t('vap.dialog.files.createTitle');
  const [newData, setNewData] = useState(fileData);
  const [oldData, setOldData] = useState(fileData);
  const [validation, setValidation] = useState({
    name: false
    // description: false
  });
  // eslint-disable-next-line no-unused-vars
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    setTimeout(() => {
      r = new Resumable({
        target: urls.vaFilesUploadFileBlock.url,
        query: {},
        headers: {},
        simultaneousUploads: 3,
        chunkSize: 5 * 1024 * 1024
      });
      if (!document.getElementById('uploadFileIpt')) return;
      r.assignBrowse(document.getElementById('uploadFileIpt'));
      r.on('fileAdded', file => {
        handleDataChange('blob', file);
      });
      r.on('fileSuccess', (file, info) => {
        const res = JSON.parse(info);
        msg.success(res.message, 'Files');
        onSave(); // close cur dialog and refresh list
        store.dispatch({
          type: 'messageCenter/delProgressBar',
          id: uploadId
        });
      });
      r.on('fileError', (file, info) => {
        const res = JSON.parse(info);
        msg.error(`Upload File ${res.message}` || 'Upload File Failure', 'Files');
        store.dispatch({
          type: 'messageCenter/delProgressBar',
          id: uploadId
        });
      });
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // init func
  function handleDataChange(type, value) {
    let data = {};
    if (type === 'blob' && value !== '') {
      setFileName(value.file.name);
      data = Object.assign({}, newData, {
        [type]: value.file,
        name: value.file.name
      });
      if (value.file.size / 1024 / 1000 > MEDIA_FILE_MAX_LENGTH) {
        validateData('name', '');
        setUploadErrorMsg(`${I18n.t('vap.dialog.files.uploadMaxError')}${MEDIA_FILE_MAX_LENGTH}MB`);
      } else {
        validateData('name', value.file.name);
        setUploadErrorMsg('');
      }
    } else if (type === 'blob' && value === '') {
      data = Object.assign({}, newData, {
        [type]: '',
        name: ''
      });
      validateData('name', '');
      setUploadErrorMsg(I18n.t('vap.dialog.common.uploadErrorMsg'));
    } else {
      data = Object.assign({}, newData, {
        [type]: value
      });
    }
    if (editOpenType === 'update') {
      validateData(type, value);
    }
    setNewData(data);
  }
  function validateData(type, value) {
    let newValidation = {};
    // if (!_.has(validation, type)) return false;
    if (_.isNil(value) || value === '') {
      newValidation = Object.assign({}, validation, {
        name: true
      });
      setValidation(newValidation);
      return false;
    } else {
      newValidation = Object.assign({}, validation, {
        name: false
      });
      setValidation(newValidation);
      return true;
    }
  }
  function handleSave() {
    if (editOpenType === 'update') {
      validateData('name', newData.name);
    }
    if (editOpenType === 'create') {
      validateData('blob', newData.blob);
    }
    const result = _.reduce(
      validation,
      (result, value) => {
        return result || value;
      },
      false
    );
    if (result || !newData.name) {
      return false;
    }
    const isEqual = _.isEqual(newData, oldData);
    if (isEqual && editOpenType === 'update') {
      VapNoChangeInfoMsg(dialogTitle);
      return false;
    }
    // onSave(newData);
    r.opts.query = { createUserId: userId };
    r.opts.headers = { Authorization: token.get() };
    r.opts.postData = {
      createUserId: userId,
      description: newData.description,
      name: newData.name
    };
    r.upload();
    uploadId = new Date().getTime();
    store.dispatch({
      type: 'messageCenter/addProgressBar',
      payload: {
        deviceName: newData.name,
        msg: 'Upload File In Progress..',
        clippingId: uploadId
      }
    });
  }

  function handleClose() {
    onClose();
  }

  useEffect(() => {
    setNewData(fileData || {});
    setOldData(fileData || {});
  }, [fileData]);

  return (
    <VapDialog
      open={open}
      title={dialogTitle}
      handleSave={handleSave}
      handleClose={handleClose}
      dialogWidth={classes.dialog}
    >
      {editOpenType === 'create' && (
        <VapUpload
          handleUploadChange={obj => handleDataChange('blob', obj)}
          uploadFileName={fileName}
          clearUploadFile={() => {
            handleDataChange('blob', '');
            setFileName('');
          }}
          uploadErrorStatus={validation.name}
          // eslint-disable-next-line prettier/prettier
          uploadErrorMsg={validation.name ? (uploadErrorMsg || I18n.t('vap.dialog.common.uploadErrorMsg')) : ''}
        />
      )}

      {editOpenType === 'create' ? (
        <TextField
          label={I18n.t('vap.dialog.common.name')}
          placeholder={I18n.t('vap.dialog.common.placeholderName')}
          value={newData.name ? newData.name : ''}
          onChange={e => handleDataChange('name', e.target.value)}
          disabled={_.isNil(newData.blob) || _.isEmpty(newData.blob)}
          fullWidth
        />
      ) : (
        <TextField
          label={I18n.t('vap.dialog.common.name')}
          placeholder={I18n.t('vap.dialog.common.placeholderName')}
          value={newData.name ? newData.name : ''}
          onChange={e => handleDataChange('name', e.target.value)}
          fullWidth
          helperText={validation.name ? I18n.t('vap.dialog.common.nameErrorMsg') : ''}
          error={validation.name}
        />
      )}

      <div className={classes.margin}>
        <TextField
          label={I18n.t('vap.dialog.common.description')}
          placeholder={I18n.t('vap.dialog.common.placeholderDescription')}
          value={newData.description ? newData.description : ''}
          onChange={e => handleDataChange('description', e.target.value)}
          // onBlur={e => validateData('description', e.target.value)}
          fullWidth
          // helperText={validation.description ? I18n.t('vap.dialog.common.descriptionErrorMsg') : ''}
          // error={validation.description}
        />
      </div>
    </VapDialog>
  );
}

VapFilesEditFileDialog.defaultProps = {
  open: false,
  onClose: () => {},
  fileData: {},
  onSave: () => {},
  editOpenType: '',
  userId: ''
};

VapFilesEditFileDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  fileData: PropTypes.object,
  onSave: PropTypes.func,
  editOpenType: PropTypes.string,
  userId: PropTypes.string
};

export default VapFilesEditFileDialog;
