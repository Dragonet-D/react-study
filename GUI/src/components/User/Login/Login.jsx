import React from 'react';
import classNames from 'classnames';
import { makeStyles, Paper } from '@material-ui/core';
import { LoginLogo, LoginPowered } from './LoginStatic';
import LoginDateTime from './LoginDateTime';
import LoginTabs from './LoginTabs';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(10),
    width: theme.spacing(57),
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  loginBody: {
    padding: theme.spacing(1.25)
  }
}));

const LoginComponent = props => {
  const classes = useStyles();
  return (
    <div className={classNames(classes.root)}>
      <Paper className={classes.loginBody}>
        <LoginLogo />
        <LoginDateTime />

        <LoginTabs {...props} />
      </Paper>
      <LoginPowered />
    </div>
  );
};

export default LoginComponent;
