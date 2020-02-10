import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, SingleSelect, MultipleSelect } from 'components/common';
import { VapDialog, VapUpload } from 'components/UVAP';
import { I18n } from 'react-i18nify';
import { VapNoChangeInfoMsg, ENGINE_MAX_LENGTH, handleVaGatewayList } from 'components/UVAP/util';
import { VAP_COMMON } from 'commons/constants/commonConstant';
import msg from 'utils/messageCenter';
import Resumable from 'libs/resumablejs';
import getUrls from 'utils/urls/index';
import store from '@/index';
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

function VapVAEnginesEditDialog(props) {
  const classes = useStyles();
  const {
    onClose,
    onSave,
    engineData,
    open,
    editOpenType,
    vaGatewayList,
    labelList,
    userId
  } = props;

  const dialogTitle =
    editOpenType === 'create'
      ? I18n.t('vap.dialog.engines.createTitle')
      : I18n.t('vap.dialog.engines.updateTitle');
  const [oldData, setOldData] = useState(engineData);

  const [vaGateway, setVaGateway] = useState('');
  const [vaGatewayError, setVaGatewayError] = useState(false);

  const [installerType, setInstallerType] = useState('');
  const [installerTypeError, setInstallerTypeError] = useState(false);

  const [file, setFile] = useState({});
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState(false);
  const [fileErrorMsg, setFileErrorMsg] = useState('');
  const [bundle, setBundle] = useState('');
  const [bundleError, setBundleError] = useState(false);

  const [displayName, setDisplayName] = useState('');
  // const [displayNameError, setDisplayNameError] = useState(false);
  // const [displayNameErrorMsg, setDisplayNameErrorMsg] = useState('');

  const [vendor, setVendor] = useState('');
  // const [vendorError, setVendorError] = useState(false);

  const [description, setDescription] = useState('');
  // const [descriptionError, setDescriptionError] = useState(false);

  const [vaGateHandledList, setVaGateHandledList] = useState([]);

  const [labels, setLabels] = useState([]);

  useEffect(() => {
    if (editOpenType !== 'create') return;
    setTimeout(() => {
      r = new Resumable({
        target: urls.vaEngineUploadFileBlock.url,
        query: {},
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

  useEffect(() => {
    if (editOpenType === 'update') {
      setOldData(engineData || {});
      setVaGateway(engineData.vaGatewayId || '');
      setInstallerType(engineData.installerType || '');
      setFileName(engineData.providerAppInfo ? engineData.providerAppInfo.name || '' : '');
      setDisplayName(engineData.name || '');
      setVendor(engineData.vendor || '');
      setDescription(engineData.description || '');
      setLabels(engineData.labels || []);
    }
  }, [engineData, editOpenType]);

  useEffect(() => {
    setVaGateHandledList(handleVaGatewayList(vaGatewayList));
  }, [vaGatewayList]);

  useEffect(() => {
    return () => {
      setOldData({});
      setVaGateway('');
      setInstallerType('');
      setFile({});
      setFileName('');
      setDisplayName('');
      setVendor('');
      setDescription('');
    };
  }, []);

  function setVaGatewayFunc(value) {
    setVaGateway(value);
    if (!_.isEmpty(value)) setVaGatewayError(false);
  }
  function setInstallerTypeFunc(value) {
    setInstallerType(value);
    if (!_.isEmpty(value)) setInstallerTypeError(false);
  }
  function handleSave() {
    if (editOpenType === 'create') {
      if (_.isEmpty(vaGateway)) {
        setVaGatewayError(true);
      }
      if (_.isEmpty(installerType)) {
        setInstallerTypeError(true);
      }
      if (_.isEmpty(file)) {
        setFileErrorMsg(I18n.t('vap.dialog.common.uploadErrorMsg'));
        setFileError(true);
      }
      if (_.isEmpty(bundle)) {
        setBundleError(true);
      }
      if (
        _.isEmpty(vaGateway) ||
        _.isEmpty(installerType) ||
        _.isEmpty(file) ||
        _.isEmpty(bundle)
      ) {
        return false;
      }
      const newData = {
        gatewayid: vaGateway,
        installerType,
        vendor,
        description,
        name: displayName,
        // file,
        labels,
        arguments: `{"bundle":"${bundle}"}`
      };
      // onSave(newData);
      r.opts.query = { createUserId: userId };
      r.opts.headers = { Authorization: token.get() };
      r.opts.postData = { userId, ...newData };
      r.upload();
      onClose();
      uploadId = new Date().getTime();
      store.dispatch({
        type: 'messageCenter/addProgressBar',
        payload: {
          deviceName: file.name,
          msg: 'Upload File In Progress..',
          clippingId: uploadId
        }
      });
    } else if (editOpenType === 'update') {
      if (_.isEmpty(vaGateway)) {
        setVaGatewayError(true);
      }
      if (_.isEmpty(installerType)) {
        setInstallerTypeError(true);
      }
      if (_.isEmpty(vaGateway) || _.isEmpty(installerType)) {
        return false;
      }
      const newData = {
        vendor,
        description,
        name: displayName,
        id: oldData.id,
        labels
      };
      const matchData = {
        ...oldData,
        ...newData
      };
      if (_.isEqual(oldData, matchData)) {
        VapNoChangeInfoMsg(dialogTitle);
        return false;
      }
      onSave(newData);
    }
  }

  function handleClose() {
    onClose();
  }

  function handleUploadChange(obj = {}) {
    setFileName(obj.file ? obj.file.name : '');
    setFile(obj.file || {});

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

  function handleSelectbundle(val) {
    setBundle(val);
    if (val === '') {
      setBundleError(true);
    } else {
      setBundleError(false);
    }
  }

  function handleClearFile() {
    setFileName('');
    setFile({});
  }
  return (
    <VapDialog
      open={open}
      title={dialogTitle}
      handleSave={handleSave}
      handleClose={handleClose}
      dialogWidth={classes.dialog}
    >
      <SingleSelect
        label={I18n.t('vap.dialog.engines.vaGateway')}
        selectOptions={vaGateHandledList}
        onSelect={setVaGatewayFunc}
        value={vaGateway}
        error={vaGatewayError}
        errorMessage={vaGatewayError ? I18n.t('vap.dialog.engines.vaGateway') : ''}
        fullWidth
        keyValue
        dataIndex={{ name: 'name', value: 'value', key: 'value' }}
        required
        disabled={editOpenType === 'update'}
      />
      <div className={classes.margin}>
        <SingleSelect
          label={I18n.t('vap.dialog.engines.installerType')}
          selectOptions={VAP_COMMON.installerTypes}
          onSelect={setInstallerTypeFunc}
          value={installerType}
          error={installerTypeError}
          errorMessage={
            installerTypeError ? I18n.t('vap.dialog.engines.installerTypeErrorMsg') : ''
          }
          fullWidth
          required
          disabled={editOpenType === 'update'}
        />
      </div>
      {editOpenType === 'create' && (
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
      )}
      {editOpenType === 'create' && (
        <div className={classes.margin}>
          <VapUpload
            handleUploadChange={handleUploadChange}
            uploadFileName={fileName || ''}
            clearUploadFile={handleClearFile}
            uploadErrorStatus={fileError}
            uploadErrorMsg={fileError ? fileErrorMsg : ''}
            disabled={editOpenType === 'update'}
            required
          />
        </div>
      )}

      <div className={classes.margin}>
        <TextField
          label={I18n.t('vap.dialog.engines.diaplayName')}
          placeholder={I18n.t('vap.dialog.engines.diaplayNamePlaceholder')}
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          fullWidth
          // error={displayNameError}
          // helperText={displayNameError ? I18n.t('vap.dialog.engines.displayNameErrorMsg') : ''}
        />
      </div>

      <div className={classes.margin}>
        <TextField
          label={I18n.t('vap.dialog.engines.vendor')}
          placeholder={I18n.t('vap.dialog.engines.vendorPlaceholder')}
          value={vendor}
          onChange={e => setVendor(e.target.value)}
          fullWidth
          // error={vendorError}
          // helperText={vendorError ? I18n.t('vap.dialog.engines.vendorErrorMsg') : ''}
        />
      </div>

      <div className={classes.margin}>
        <TextField
          label={I18n.t('vap.dialog.engines.description')}
          placeholder={I18n.t('vap.dialog.engines.descriptionPlaceholder')}
          value={description}
          onChange={e => setDescription(e.target.value)}
          fullWidth
          // error={descriptionError}
          // helperText={descriptionError ? I18n.t('vap.dialog.engines.descriptionErrorMsg') : ''}
        />
      </div>

      <div className={classes.margin}>
        <MultipleSelect
          label={I18n.t('vap.dialog.engines.labels')}
          value={labels}
          selectOptions={labelList}
          onSelect={setLabels}
          keyValue
          dataIndex={{ name: 'codeValue', key: 'codeUuid', value: 'codeValue' }}
        />
      </div>
    </VapDialog>
  );
}

VapVAEnginesEditDialog.defaultProps = {
  open: false,
  onClose: () => {},
  engineData: {},
  onSave: () => {},
  editOpenType: '',
  labelList: []
};

VapVAEnginesEditDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  engineData: PropTypes.object,
  onSave: PropTypes.func,
  editOpenType: PropTypes.string,
  labelList: PropTypes.array
};

export default VapVAEnginesEditDialog;
