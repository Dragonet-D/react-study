import React from 'react';
import { makeStyles } from '@material-ui/core';
import loadingImage from './images/small-load.gif';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'flex',
    backgroundColor: '#15191f',
    height: '100%',
    width: '100%',
    zIndex: 9999
  },
  loadingPageBG: {
    margin: 'auto',
    background: `url(${loadingImage}) no-repeat`,
    height: '100%',
    width: 800
  }
}));

const LoginLoadingPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.loadingPageBG} />
    </div>
  );
};

export default LoginLoadingPage;
