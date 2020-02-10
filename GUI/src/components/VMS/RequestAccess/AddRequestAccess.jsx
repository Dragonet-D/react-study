import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { I18n } from 'react-i18nify';
import { Button, DialogTitle } from 'components/common';
import DataTreeView from './DataTreeView';
// import SaveAlt from '@material-ui/icons/SaveAlt';

function AddRequest(props) {
  const { onClose, groupDataSource } = props;
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    onClose();
  }

  function selectKey() {}

  React.useEffect(() => {
    handleClickOpen();
  }, []);

  const fullwidth = true;

  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        fullWidth={fullwidth}
        maxWidth="lg"
        style={{
          width: '100%',
          height: 'auto'
        }}
      >
        <DialogTitle>{I18n.t('uvms.requestAccess.addRequest.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            {groupDataSource && <DataTreeView dataSource={groupDataSource} selectKey={selectKey} />}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {I18n.t('uvms.requestAccess.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddRequest;
