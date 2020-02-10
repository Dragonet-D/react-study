import React from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => {
  return {
    title: {
      color: theme.palette.text.secondary,
      paddingLeft: theme.spacing(1),
      fontWeight: 600,
      height: theme.spacing(5),
      display: 'flex',
      alignItems: 'center'
    }
  };
});

function BasicLayoutTitle({ titleName, children }) {
  const classes = useStyles();
  return (
    <>
      <Typography component="div" className={classes.title}>
        <span>{titleName}</span>
        {children}
      </Typography>
      <Divider />
    </>
  );
}

export default BasicLayoutTitle;
