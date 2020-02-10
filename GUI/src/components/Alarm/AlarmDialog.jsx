import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import { Button, DialogTitle } from 'components/common';
import { I18n } from 'react-i18nify';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => {
  return {
    dialog: {
      width: '960px',
      maxWidth: '960px'
    }
  };
});

function AlarmDialog(props) {
  const classes = useStyles();
  const {
    children,
    title,
    open,
    handleSave,
    handleClose,
    dialogWidth,
    isActionNeeded,
    action
  } = props;
  return (
    <Dialog open={open} classes={{ paperWidthSm: dialogWidth || classes.dialog }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {action}
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

AlarmDialog.defaultProps = {
  isActionNeeded: true,
  action: ''
};

AlarmDialog.propTypes = {
  isActionNeeded: PropTypes.bool,
  action: PropTypes.any
};

export default AlarmDialog;
