import React from 'react';
import { routerRedux } from 'dva';
import store from '@/index';
import { I18n } from 'react-i18nify';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      height: 'calc(100% - 40px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    content: {
      display: 'flex',
      alignItems: 'center'
    },
    btn: {
      marginLeft: '8px'
    }
  };
});

function NoSpecialWatchList() {
  const classes = useStyles();

  function handleGo() {
    store.dispatch(routerRedux.push('/uvap/face/face-enrollment'));
  }
  return (
    <div className={classes.wrapper}>
      <div className={classes.content}>
        <Typography variant="h6" color="textSecondary">
          {I18n.t('vap.remindInformation.noSpecialWatchList')}
        </Typography>
        <Button className={classes.btn} color="secondary" variant="outlined" onClick={handleGo}>
          {I18n.t('vap.remindInformation.goAndCreate')}
        </Button>
      </div>
    </div>
  );
}

export default NoSpecialWatchList;
