import React from 'react';
import { I18n } from 'react-i18nify';
import { makeStyles } from '@material-ui/core';
import loginLogo from './images/IVH.logo.png';
import loginPowered from './images/logo-ncs.png';

const useStyles = makeStyles(theme => ({
  loginLogo: {
    height: theme.spacing(14),
    width: theme.spacing(52),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(1.5),
    paddingTop: theme.spacing(2),
    color: theme.palette.text.primary
  },
  ivhLogo: {
    width: theme.spacing(11.25),
    heigth: theme.spacing(11.25)
  },
  loginPowered: {
    padding: `${theme.spacing(12.5)}px 0 ${theme.spacing(1.875)}px`,
    textAlign: 'center',
    fontSize: theme.typography.fontSize * 0.857
  }
}));

export const LoginLogo = () => {
  const classes = useStyles();
  return (
    <div className={classes.loginLogo}>
      <img className={classes.ivhLogo} src={loginLogo} alt="IVH LOGO" />
    </div>
  );
};

export const LoginPowered = () => {
  const classes = useStyles();
  return (
    <div className={classes.loginPowered}>
      {I18n.t('user.login.content.powerBy')}
      &nbsp;
      <img src={loginPowered} alt="NCS Logo" />
    </div>
  );
};
