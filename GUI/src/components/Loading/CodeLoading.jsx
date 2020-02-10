import React from 'react';
import { makeStyles } from '@material-ui/core';
import { I18n } from 'react-i18nify';

const useStyles = makeStyles(theme => {
  const loadingSize = theme.spacing(6);
  return {
    wrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    loading: {
      width: loadingSize,
      height: loadingSize
    },
    progress: {
      width: loadingSize,
      height: loadingSize,
      color: theme.palette.text.secondary
    }
  };
});

function CodeLoading() {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <div className={classes.loading}>{`${I18n.t('global.remindInformation.loading')}...`}</div>
    </div>
  );
}

export default CodeLoading;
