import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { makeStyles, Typography } from '@material-ui/core';
import Moment from 'moment';

const useStyels = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(1)}px`,
    marginBottom: theme.spacing(7),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(1)
  },
  textStyle: {
    color: theme.palette.text.primary
  }
}));

const LoginDateTime = () => {
  const classes = useStyels();
  const current = new Moment();
  const [dateTime, setDateTime] = useState({
    month: current.format('MMMM DD'),
    week: current.format('YYYY, dddd'),
    time: current.format('hh:mm A')
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const dt = new Moment();
      setDateTime({
        month: dt.format('MMMM DD'),
        week: dt.format('YYYY, dddd'),
        time: dt.format('hh:mm A')
      });
    }, 1000);

    return function cleanup() {
      clearInterval(interval);
    };
  });

  return (
    <div className={classNames(classes.root, classes.textStyle)}>
      <Typography variant="h5" className={classes.textStyle}>
        {dateTime.month}
      </Typography>
      <p id="lblWeek">{dateTime.week}</p>
      <p id="lblTime">{dateTime.time}</p>
      <p style={{ fontSize: '12px' }}>Version: LATEST</p>
    </div>
  );
};

export default LoginDateTime;
