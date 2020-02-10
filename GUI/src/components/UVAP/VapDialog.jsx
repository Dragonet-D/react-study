import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import { Loading } from 'components/Loading';
import DialogActions from '@material-ui/core/DialogActions';
import { Button, DialogTitle } from 'components/common';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => {
  return {
    dialog: {
      width: '960px',
      maxWidth: '960px'
    },
    loading: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 1
    }
  };
});

function VapDialog(props) {
  const classes = useStyles();
  const {
    children,
    loading,
    title,
    open,
    handleSave,
    handleClose,
    dialogWidth,
    dialogContent
  } = props;
  return (
    <Dialog open={open} classes={{ paperWidthSm: dialogWidth || classes.dialog }}>
      {loading && (
        <div className={classes.loading}>
          <Loading size="small" />
        </div>
      )}
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={dialogContent}>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

VapDialog.defaultProps = {
  loading: false,
  title: '',
  open: false,
  handleSave: () => {},
  handleClose: () => {},
  dialogWidth: {},
  dialogContent: {}
};

VapDialog.propTypes = {
  loading: PropTypes.bool,
  title: PropTypes.string,
  open: PropTypes.bool,
  handleSave: PropTypes.func,
  handleClose: PropTypes.func,
  dialogWidth: PropTypes.object,
  dialogContent: PropTypes.object
};

export default VapDialog;
