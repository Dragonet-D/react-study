/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, DatePicker } from 'components/common';
import { VapDialog } from 'components/UVAP';
import { I18n } from 'react-i18nify';
import { VapNoChangeInfoMsg } from 'components/UVAP/util';
import { DATE_FORMAT_DD_MM_YYYY } from 'commons/constants/const';

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

function LicenseEditDIalog(props) {
  const classes = useStyles();
  const { loading, onClose, onSave, open, currentData, editOpenType } = props;
  const dialogTitle =
    editOpenType === 'update'
      ? I18n.t('vap.dialog.license.updateTitle')
      : I18n.t('vap.dialog.license.viewTitle');
  const [expiry, setExpiry] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [validation, dispatchValidation] = useReducer(validateAction, {
    expiry: false,
    host: false,
    port: false,
    macAddress: false
  });
  const [keyType, setKeyType] = useState('');
  const [newData, setNewData] = useState({});
  const [oldData, setOldData] = useState({});
  function validateAction(info, action) {
    switch (action.type) {
      case 'reset':
        return { expiry: false, host: false, port: false, macAddress: false };
      case 'expiry':
        return { ...info, expiry: action.data };
      case 'host':
        return { ...info, host: action.data };
      case 'port':
        return { ...info, port: action.data };
      case 'macAddress':
        return { ...info, macAddress: action.data };
      default:
        throw new Error();
    }
  }
  // init func

  function handleSave() {
    if (_.isNil(expiry) || expiry === '') {
      dispatchValidation({ type: 'expiry', data: true });
    } else {
      dispatchValidation({ type: 'expiry', data: false });
    }
    if (_.isNil(host) || host === '') {
      dispatchValidation({ type: 'host', data: true });
    } else {
      dispatchValidation({ type: 'host', data: false });
    }
    if (_.isNil(port) || port === '') {
      dispatchValidation({ type: 'port', data: true });
    } else {
      dispatchValidation({ type: 'port', data: false });
    }
    if (_.isNil(macAddress) || macAddress === '') {
      dispatchValidation({ type: 'macAddress', data: true });
    } else {
      dispatchValidation({ type: 'macAddress', data: false });
    }
    if (
      _.isNil(expiry) ||
      expiry === '' ||
      _.isNil(host) ||
      host === '' ||
      _.isNil(port) ||
      port === '' ||
      _.isNil(macAddress) ||
      macAddress === ''
    ) {
      return false;
    }
    const editedData = _.cloneDeep(oldData);
    editedData.restriction = {
      expiry: expiry / 1000,
      host,
      port,
      macAddress
    };
    if (_.isEqual(editedData, oldData)) {
      VapNoChangeInfoMsg(dialogTitle);
      return false;
    }
    onSave(editedData.restriction);
  }

  function handleClose() {
    onClose();
  }
  useEffect(() => {
    if (!_.isNil(expiry) && expiry !== '') {
      dispatchValidation({ type: 'expiry', data: false });
    }
  }, [expiry]);
  useEffect(() => {
    if (!_.isNil(host) && host !== '') {
      dispatchValidation({ type: 'host', data: false });
    }
  }, [host]);
  useEffect(() => {
    if (!_.isNil(port) && port !== '') {
      dispatchValidation({ type: 'port', data: false });
    }
  }, [port]);
  useEffect(() => {
    if (!_.isNil(macAddress) && macAddress !== '') {
      dispatchValidation({ type: 'macAddress', data: false });
    }
  }, [macAddress]);
  useEffect(() => {
    setNewData(currentData);
    setOldData(currentData);
    setExpiry(currentData.restriction.expiry * 1000);
    setHost(currentData.restriction.host);
    setPort(currentData.restriction.port);
    setMacAddress(currentData.restriction.macAddress);
    setKeyType(currentData.keyType);
  }, [currentData]);
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
        label={I18n.t('vap.dialog.license.host')}
        placeholder={I18n.t('vap.dialog.license.hostPlaceholder')}
        value={host || ''}
        onChange={e => setHost(e.target.value)}
        fullWidth
        error={validateAction.host}
        helperText={validateAction.host ? I18n.t('vap.dialog.license.hostErrorMsg') : ''}
        required
      />
      <div className={classes.margin}>
        <TextField
          label={I18n.t('vap.dialog.license.port')}
          placeholder={I18n.t('vap.dialog.license.portPlaceholder')}
          value={_.toString(port) || ''}
          onChange={e => setPort(e.target.value)}
          fullWidth
          error={validateAction.port}
          helperText={validateAction.port ? I18n.t('vap.dialog.license.portErrorMsg') : ''}
          required
        />
      </div>
      <div className={classes.margin}>
        <DatePicker
          value={expiry}
          handleChange={val => setExpiry(new Date(val).getTime())}
          label={I18n.t('vap.dialog.license.expiry')}
          type="date"
          format={DATE_FORMAT_DD_MM_YYYY}
          required
          fullWidth
        />
      </div>
      <div className={classes.margin}>
        <TextField
          label={I18n.t('vap.dialog.license.macAddress')}
          placeholder={I18n.t('vap.dialog.license.macAddressPlaceholder')}
          value={macAddress || ''}
          onChange={e => setMacAddress(e.target.value)}
          fullWidth
          error={validateAction.macAddress}
          helperText={
            validateAction.macAddress ? I18n.t('vap.dialog.license.macAddressErrorMsg') : ''
          }
          required
        />
      </div>
    </VapDialog>
  );
}

LicenseEditDIalog.defaultProps = {
  open: false,
  onClose: () => {},
  onSave: () => {},
  currentData: {},
  editOpenType: ''
};

LicenseEditDIalog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  currentData: PropTypes.object,
  editOpenType: PropTypes.string
};

export default LicenseEditDIalog;
