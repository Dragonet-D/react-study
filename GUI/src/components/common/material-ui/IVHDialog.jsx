import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import { Button, DialogTitle } from 'components/common';
import { I18n } from 'react-i18nify';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => {
  return {
    dialog: {
      width: 700,
      height: 300
    },
    title: {
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`
    }
  };
});

function IVHDialog(props) {
  const classes = useStyles();
  const {
    children,
    title,
    open,
    handleSave,
    handleClose,
    dialogWidth,
    style,
    isActionNeed,
    isCancelNeed,
    action,
    disableSave,
    ...reset
  } = props;
  return (
    <Dialog
      open={open}
      classes={{ paperWidthSm: dialogWidth || classes.dialog }}
      style={{ ...style }}
      {...reset}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {action}
        {isActionNeed && (
          <Button onClick={handleSave} color="primary" disabled={disableSave}>
            {I18n.t('global.button.save')}
          </Button>
        )}
        {isCancelNeed && (
          <Button onClick={handleClose} color="primary">
            {I18n.t('global.button.cancel')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

IVHDialog.defaultProps = {
  style: {},
  dialogWidth: null,
  title: '',
  handleSave: () => {},
  handleClose: () => {},
  isActionNeed: true,
  isCancelNeed: true,
  action: '',
  disableSave: false
};

IVHDialog.propTypes = {
  style: PropTypes.object,
  dialogWidth: PropTypes.string,
  title: PropTypes.any,
  handleSave: PropTypes.func,
  handleClose: PropTypes.func,
  isActionNeed: PropTypes.bool,
  isCancelNeed: PropTypes.bool,
  action: PropTypes.any,
  disableSave: PropTypes.bool
};

export default IVHDialog;
