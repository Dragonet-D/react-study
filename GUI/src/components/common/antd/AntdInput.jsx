import React, { forwardRef } from 'react';
import { Input } from 'antd';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => {
  const textPrimary = theme.palette.text.primary;
  return {
    '@global': {
      '.ant-input': {
        backgroundColor: 'transparent!important',
        color: textPrimary,
        fontSize: theme.typography.subtitle2.fontSize
      },
      '.ant-input:hover, .ant-input:focus': {
        borderColor: theme.palette.text.secondary
      },
      '.ant-input[disabled]': {
        color: theme.palette.text.disabled || textPrimary
      }
    },
    form: {}
  };
});

const AntdInput = forwardRef((props, ref) => {
  const classes = useStyles();
  return <Input ref={ref} className={classes.form} {...props} />;
});

export default AntdInput;
