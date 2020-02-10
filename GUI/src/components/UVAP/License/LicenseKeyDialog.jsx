import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { VapDialog } from 'components/UVAP';
import { I18n } from 'react-i18nify';
import Typography from '@material-ui/core/Typography';

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

function LicenseKeyDialog(props) {
  const classes = useStyles();
  const { loading, onClose, licenseKey, open } = props;
  const dialogTitle = I18n.t('vap.dialog.license.keyTitle');
  function handleClose() {
    onClose();
  }
  return (
    <VapDialog
      open={open}
      title={dialogTitle}
      loading={loading}
      handleClose={handleClose}
      dialogWidth={classes.dialog}
    >
      <Typography component="h5">{licenseKey}</Typography>
    </VapDialog>
  );
}

LicenseKeyDialog.defaultProps = {
  loading: false,
  open: false,
  onClose: () => {},
  licenseKey: ''
};

LicenseKeyDialog.propTypes = {
  loading: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  licenseKey: PropTypes.string
};

export default LicenseKeyDialog;
