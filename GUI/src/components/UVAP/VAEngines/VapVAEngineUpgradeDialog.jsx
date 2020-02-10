/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, SingleSelect } from 'components/common';
import { VapDialog, VapUpload } from 'components/UVAP';
import { I18n } from 'react-i18nify';
import { ENGINE_MAX_LENGTH } from 'components/UVAP/util';
import getUrls from 'utils/urls/index';
import store from '@/index';
import Resumable from 'libs/resumablejs';
import msg from 'utils/messageCenter';
import token from 'utils/tokenHelper';

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

function VapVAEngineUpgradeDialog(props) {
  const classes = useStyles();
  const { onClose, onSave, engineData, open, userId } = props;
  const dialogTitle = I18n.t('vap.dialog.engines.upgradeTitle');
  const [currentName, setCurrentName] = useState('');
  const [newName, setNewName] = useState('');
  const [newFile, setNewFile] = useState({});
  const [fileError, setFileError] = useState(false);
  const [fileErrorMsg, setFileErrorMsg] = useState('');
  const [bundle, setBundle] = useState('');
  const [bundleError, setBundleError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      r = new Resumable({
        target: urls.vaEngineUpgradeFileBlock.url,
        query: {},
        headers: {},
        simultaneousUploads: 3,
        chunkSize: 5 * 1024 * 1024
      });
      if (!document.getElementById('uploadFileIpt')) return;
      r.assignBrowse(document.getElementById('uploadFileIpt'));
      r.on('fileAdded', file => {
        handleUploadChange(file);
      });
      r.on('fileSuccess', (file, info) => {
        const res = JSON.parse(info);
        msg.success(res.message, 'VA Engines');
        onSave(); // close cur dialog and refresh list
        store.dispatch({
          type: 'messageCenter/delProgressBar',
          id: uploadId
        });
      });
      r.on('fileError', (file, info) => {
        const res = JSON.parse(info);
        msg.error(`Upload File ${res.message}` || 'Upload File Failure', 'VA Engines');
        store.dispatch({
          type: 'messageCenter/delProgressBar',
          id: uploadId
        });
      });
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // init func
  function handleSave() {
    let isValidate = true;
    if (_.isEmpty(newFile)) {
      setFileErrorMsg(I18n.t('vap.dialog.common.uploadErrorMsg'));
      setFileError(true);
      isValidate = false;
    }
    if (bundle === '') {
      setBundleError(true);
      isValidate = false;
    }
    if (isValidate) {
      r.opts.query = { createUserId: userId };
      r.opts.headers = { Authorization: token.get() };
      r.opts.postData = {
        createUserId: userId,
        id: engineData.id,
        arguments: JSON.stringify({ bundle })
      };
      r.upload();
      uploadId = new Date().getTime();
      store.dispatch({
        type: 'messageCenter/addProgressBar',
        payload: {
          deviceName: newFile.name,
          msg: 'Upload File In Progress..',
          clippingId: uploadId
        }
      });
    }
  }

  function handleClose() {
    onClose();
  }
  function handleUploadChange(obj = {}) {
    setNewName(obj.file ? obj.file.name : '');
    setNewFile(obj.file || {});

    if (_.isNil(obj.file)) {
      setFileErrorMsg(I18n.t('vap.dialog.common.uploadErrorMsg'));
      setFileError(true);
      return false;
    } else {
      setFileErrorMsg('');
      setFileError(false);
    }

    if (obj.file.size / 1024 / 1000 > ENGINE_MAX_LENGTH) {
      setFileErrorMsg(`${I18n.t('vap.dialog.engines.uploadMaxError')}${ENGINE_MAX_LENGTH}MB`);
      setFileError(true);
    }
  }
  function handleClearFile() {
    setNewName('');
    setNewFile({});
  }

  function handleSelectbundle(val) {
    setBundle(val);
    if (val === '') {
      setBundleError(true);
    } else {
      setBundleError(false);
    }
  }

  useEffect(() => {
    setCurrentName(engineData.name ? engineData.name || '' : '');
  }, [engineData]);

  useEffect(() => {
    return () => {
      setCurrentName('');
      setNewName('');
      setNewFile({});
      setFileError(false);
      setFileErrorMsg('');
      setBundleError(false);
      setBundle('');
    };
  }, []);

  return (
    <VapDialog
      open={open}
      title={dialogTitle}
      handleSave={handleSave}
      handleClose={handleClose}
      dialogWidth={classes.dialog}
    >
      <TextField
        label={I18n.t('vap.dialog.engines.currentName')}
        value={currentName || ''}
        fullWidth
        disabled
      />
      <div className={classes.margin}>
        <VapUpload
          handleUploadChange={handleUploadChange}
          uploadFileName={newName || ''}
          clearUploadFile={handleClearFile}
          uploadErrorStatus={fileError}
          uploadErrorMsg={fileError ? fileErrorMsg : ''}
          required
        />
      </div>
      <div className={classes.margin}>
        <SingleSelect
          label={I18n.t('vap.dialog.engines.bundle')}
          selectOptions={['true', 'false']}
          onSelect={handleSelectbundle}
          value={bundle}
          error={bundleError}
          errorMessage={bundleError ? I18n.t('vap.dialog.engines.bundleErrorMsg') : ''}
          fullWidth
          required
        />
      </div>
    </VapDialog>
  );
}

VapVAEngineUpgradeDialog.defaultProps = {
  open: false,
  onClose: () => {},
  engineData: {},
  onSave: () => {},
  userId: ''
};

VapVAEngineUpgradeDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  engineData: PropTypes.object,
  onSave: PropTypes.func,
  userId: PropTypes.string
};

export default VapVAEngineUpgradeDialog;
