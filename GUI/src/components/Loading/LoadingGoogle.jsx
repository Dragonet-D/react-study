import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './Loading.css';

const useStyles = makeStyles(theme => {
  const { messageCenter = {} } = theme.palette;
  return {
    wrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      zIndex: 1700,
      cursor: 'not-allowed'
    },
    content: {
      backgroundColor: 'transparent'
    },
    shape1: {
      backgroundColor: messageCenter.info
    },
    shape2: {
      backgroundColor: messageCenter.error
    },
    shape3: {
      backgroundColor: messageCenter.success
    },
    shape4: {
      backgroundColor: messageCenter.warning
    }
  };
});

function generateLoading() {
  return Math.ceil(Math.random() * 4);
}

const animationType = generateLoading(); // 1-4

function LoadingGoogle() {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <div className={classes.content}>
        <div className={`common_loading_container animation-${animationType}`}>
          <div className={`shape shape1 ${classes.shape1}`} />
          <div className={`shape shape2 ${classes.shape2}`} />
          <div className={`shape shape3 ${classes.shape3}`} />
          <div className={`shape shape4 ${classes.shape4}`} />
        </div>
      </div>
    </div>
  );
}

export default LoadingGoogle;
