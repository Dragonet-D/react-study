import React, { useState, memo } from 'react';
import { Upload, ToolTip } from 'components/common';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Clear, FolderOpen } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import PropTypes from 'prop-types';
import styles from './FileUpload.module.less';

const useStyles = makeStyles(theme => {
  return {
    file_icon: {
      color: theme.palette.text.primary
    }
  };
});

const FileUpload = memo(props => {
  const classes = useStyles();
  const { getFile, handleTempFileDownload } = props;
  const [fileName, setFileName] = useState('');
  function clearUploadFile() {
    setFileName('');
    getFile('');
  }
  function handleUploadChange(e) {
    const { name } = e.file;
    setFileName(name);
    getFile(e.file);
  }

  return (
    <div className={styles.wrapper}>
      <div className={classNames(styles.upload_wrapper)}>
        {fileName && <Typography component="div">{fileName}</Typography>}
        <IconButton
          onClick={clearUploadFile}
          size="small"
          style={{ display: fileName ? 'flex' : 'none' }}
        >
          <Clear />
        </IconButton>
        <Button size="small" className={classes.button_wrapper}>
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
      <ToolTip title="Download File">
        <IconButton onClick={() => handleTempFileDownload()}>
          <SaveAltIcon />
        </IconButton>
      </ToolTip>
    </div>
  );
});

FileUpload.defaultProps = {
  getFile: () => {},
  handleTempFileDownload: () => {}
};

FileUpload.propTypes = {
  getFile: PropTypes.func,
  handleTempFileDownload: PropTypes.func
};

export default FileUpload;
