import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import { Button, DialogTitle } from 'components/common';
import { I18n } from 'react-i18nify';

const useStyles = makeStyles(() => {
  return {
    dialog: {
      width: '960px',
      maxWidth: '960px'
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
    dialogSize,
    isActionNeeded,
    ...reset
  } = props;
  return (
    <Dialog open={open} classes={{ paperWidthSm: dialogSize || classes.dialog }} {...reset}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {isActionNeeded && (
          <Button onClick={handleSave} color="primary">
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

IVHDialog.defaultProps = {
  title: '',
  open: false,
  handleSave: () => {},
  handleClose: () => {},
  dialogSize: '',
  isActionNeeded: true
};

IVHDialog.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  handleSave: PropTypes.func,
  handleClose: PropTypes.func,
  dialogSize: PropTypes.string,
  isActionNeeded: PropTypes.bool
};

export default IVHDialog;
