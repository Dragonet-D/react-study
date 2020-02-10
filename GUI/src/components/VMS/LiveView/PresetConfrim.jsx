import React from 'react';
import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { I18n } from 'react-i18nify';
import Slide from '@material-ui/core/Slide';

import { Button, TextField } from 'components/common';

const useStyles = makeStyles(theme => {
  return {
    dialogTitle: {
      color: theme.palette.primary.main
    },
    dateTimePicker: {
      width: '230px',
      float: 'left',
      marginLeft: theme.spacing(1)
    },
    infoSec: {
      width: '33%',
      float: 'left'
    },
    textField: {
      width: '90%'
    }
  };
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PresetConfrim(props) {
  const { onClose, setPTZpreset, item, itemSource, pageNo, pageSize } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [namestr, setnamestr] = React.useState(item.name);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    onClose();
  }
  function handleConfirm() {
    const type = item.name === namestr ? 'set' : 'update';
    setPTZpreset(type, namestr, item.index, { itemSource, pageNo, pageSize });
    setOpen(false);
    onClose();
  }
  React.useEffect(() => {
    handleClickOpen();
  }, []);

  const fullwidth = true;

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth={fullwidth}
        maxWidth="sm"
        style={{
          width: '100%',
          height: 'auto'
        }}
      >
        <DialogTitle id="alert-dialog-slide-title" className={classes.dialogTitle}>
          <span className={classes.dialogTitle}>
            {`${I18n.t('uvms.live.presetConfirm.title')} ${itemSource.channelName}`}
          </span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <div>
              <TextField
                id="standard-select-currency"
                label={I18n.t('uvms.live.presetConfirm.presetName')}
                className={classes.textField}
                value={namestr}
                onChange={e => {
                  setnamestr(e.target.value);
                }}
                helperText={I18n.t('uvms.live.presetConfirm.helperText')}
                margin="normal"
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary">
            {I18n.t('uvms.live.button.confirm')}
          </Button>
          <Button onClick={handleClose} color="primary">
            {I18n.t('uvms.live.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PresetConfrim;
