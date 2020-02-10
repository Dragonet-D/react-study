import React, { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { FolderOpen, Clear } from '@material-ui/icons';
import { Upload } from 'components/common';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => {
  return {
    upload_wrapper: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    file_name: {
      width: '80%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    button_wrapper: {
      padding: 0,
      minWidth: '50px',
      minHeight: '30px'
    },
    file_icon: {
      color: theme.palette.text.primary
    },
    upload_error: {
      backgroundColor: theme.palette.error.main
    },
    upload_error_msg: {
      color: theme.palette.error.main
    }
  };
});

function VapUpload(props) {
  const classes = useStyles();
  const {
    uploadFileName,
    clearUploadFile,
    handleUploadChange,
    uploadErrorStatus,
    uploadErrorMsg,
    required,
    disabled
  } = props;
  return (
    <Fragment>
      <div className={classes.upload_wrapper}>
        <Typography className={classes.file_name} component="div">
          {required && <span className="MuiFormLabel-asterisk MuiInputLabel-asterisk"> *</span>}
          {uploadFileName}
        </Typography>
        {uploadFileName && !disabled && (
          <IconButton onClick={clearUploadFile}>
            <Clear />
          </IconButton>
        )}
        <Button size="small" color="primary" className={classes.button_wrapper} disabled={disabled}>
          <Upload
            name="file"
            showUploadList={false}
            action=""
            beforeUpload={() => false}
            onChange={handleUploadChange}
            id="uploadFileIpt"
          >
            <FolderOpen className={classes.file_icon} />
          </Upload>
        </Button>
      </div>
      <Divider className={`${uploadErrorStatus ? classes.upload_error : ''}`} />
      {uploadErrorStatus && <div className={classes.upload_error_msg}>{uploadErrorMsg}</div>}
    </Fragment>
  );
}

VapUpload.defaultProps = {
  uploadFileName: '',
  clearUploadFile: () => {},
  handleUploadChange: () => {},
  uploadErrorStatus: false,
  uploadErrorMsg: '',
  required: false,
  disabled: false
};

VapUpload.propTypes = {
  uploadFileName: PropTypes.string,
  clearUploadFile: PropTypes.func,
  handleUploadChange: PropTypes.func,
  uploadErrorStatus: PropTypes.bool,
  uploadErrorMsg: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool
};

export default VapUpload;
