import React from 'react';
import { I18n } from 'react-i18nify';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  content: {
    color: theme.palette.primary.main,
    margin: 'auto auto',
    fontSize: 25,
    fontWeight: 800
  }
}));

export default function NoPermissionPage() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.content}>{I18n.t('global.exception.map403')}</div>
    </div>
  );
}
