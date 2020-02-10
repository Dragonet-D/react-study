import React from 'react';
import { CircularProgress, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

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

function Loading(props) {
  const classes = useStyles();
  const { size } = props;
  return (
    <div className={classes.wrapper}>
      <div className={classes.loading}>
        <CircularProgress className={classes.progress} size={size} />
      </div>
    </div>
  );
}

Loading.defaultProps = {
  size: 'large'
};

Loading.propTypes = {
  size: PropTypes.string
};

export default Loading;
