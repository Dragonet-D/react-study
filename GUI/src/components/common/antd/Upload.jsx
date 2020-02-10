import React from 'react';
import { Upload } from 'antd';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    wrapper: {
      width: '100%',
      '@global': {
        '.ant-upload': {
          backgroundColor: 'transparent',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          height: '100%',
          border: 'none',
          color: theme.palette.text.secondary
        },
        '.ant-upload.ant-upload-select-picture-card': {
          backgroundColor: 'transparent',
          width: '100%',
          margin: 0
        },
        '.ant-upload.ant-upload-select-picture-card > .ant-upload': {
          display: 'flex',
          padding: 0
        }
      }
    }
  };
});

function IVHUpload(props) {
  const { children, ...rest } = props;
  const classes = useStyles();
  return (
    <Upload className={classes.wrapper} {...rest}>
      {children}
    </Upload>
  );
}

export default IVHUpload;
