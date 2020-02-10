import React from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Clear, FolderOpen } from '@material-ui/icons';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Divider from '@material-ui/core/Divider';
import { I18n } from 'react-i18nify';
import { Button, Upload } from '../common';

const useStyles = makeStyles(theme => {
  return {
    upload_wrapper: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    button_wrapper: {
      padding: 0,
      minWidth: '50px',
      minHeight: '30px'
    },
    file_icon: {
      color: theme.palette.text.primary
    },
    file_name: {
      width: '80%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    upload_error: {
      backgroundColor: theme.palette.error.main
    },
    upload_error_msg: {
      color: theme.palette.error.main
    }
  };
});

const FileUpload = props => {
  const classes = useStyles();
  const { uploadFileName, clearUploadFile, handleUploadChange, uploadErrorStatus } = props;
  return (
    <>
      <Typography color="textSecondary" variant="subtitle2">
        Attachment
      </Typography>
      <div className={classes.upload_wrapper}>
        <Typography className={classes.file_name} component="div">
          {uploadFileName}
        </Typography>
        {uploadFileName && (
          <IconButton onClick={clearUploadFile} size="small">
            <Clear />
          </IconButton>
        )}
        <Button size="small" color="primary" className={classes.button_wrapper}>
          <Upload
            name="file"
            showUploadList={false}
            action=""
            beforeUpload={() => false}
            onChange={handleUploadChange}
          >
            <FolderOpen className={classes.file_icon} />
          </Upload>
        </Button>
      </div>
      <Divider className={`${uploadErrorStatus ? classes.upload_error : ''}`} />
      {uploadErrorStatus && (
        <div className={classes.upload_error_msg}>
          {I18n.t('alarm.remindInformation.UPLOAD_ERROR')}
        </div>
      )}
    </>
  );
};

FileUpload.defaultProps = {
  uploadFileName: '',
  clearUploadFile: () => {},
  handleUploadChange: () => {}
};

export default FileUpload;
