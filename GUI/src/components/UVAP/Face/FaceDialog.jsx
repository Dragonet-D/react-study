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

function FaceDialog(props) {
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
    action,
    disableSave
  } = props;
  return (
    <Dialog
      open={open}
      classes={{ paperWidthSm: dialogWidth || classes.dialog }}
      style={{ ...style }}
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
        <Button onClick={handleClose} color="primary">
          {I18n.t('global.button.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FaceDialog.defaultProps = {
  style: {},
  dialogWidth: null,
  title: '',
  handleSave: () => {},
  handleClose: () => {},
  isActionNeed: true,
  action: '',
  disableSave: false
};

FaceDialog.propTypes = {
  style: PropTypes.object,
  dialogWidth: PropTypes.string,
  title: PropTypes.any,
  handleSave: PropTypes.func,
  handleClose: PropTypes.func,
  isActionNeed: PropTypes.bool,
  action: PropTypes.any,
  disableSave: PropTypes.bool
};

export default FaceDialog;
