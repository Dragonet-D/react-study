import React from 'react'; // , { useCallback }
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FolderOpen from '@material-ui/icons/FolderOpen';
import { Input, Button, DialogTitle } from 'components/common';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';

function UploadDialog(props) {
  const { openDialog, onClose, handleSubmit } = props;
  const [file, setfile] = React.useState('');
  const [errState, setErrState] = React.useState(false);

  function onUpload() {
    if (!file) {
      setErrState(true);
      return;
    }
    handleSubmit(file);
  }

  const handleUploadChange = e => {
    const { files } = e.target;
    setfile(files[0]);
  };

  const dialogRender = () => {
    return (
      <Dialog open={openDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Upload</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <FormControl error={errState} fullWidth>
              <InputLabel>Choose Files</InputLabel>
              <Input
                placeholder="Choose Files"
                value={!file ? '' : file.name}
                onClick={() => {
                  setErrState(false);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="Choose Files">
                      <label htmlFor="contained-button-file">
                        <FolderOpen />
                      </label>
                    </IconButton>
                  </InputAdornment>
                }
              />
              <input
                style={{ display: 'none' }}
                id="contained-button-file"
                multiple
                onChange={handleUploadChange}
                type="file"
                accept="image/bmp,image/png,image/gif,image/jpg,image/jpeg,image/pjpeg,image/x-icon"
              />
              <FormHelperText>{errState ? VALIDMSG_NOTNULL : ''}</FormHelperText>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onUpload} color="primary">
            Save
          </Button>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return dialogRender();
}

export default UploadDialog;
