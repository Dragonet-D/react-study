import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(() => {
  return {
    root: {
      paddingBottom: 0
    }
  };
});

function DialogTitles({ children }) {
  const classes = useStyles();
  return (
    <DialogTitle classes={{ root: classes.root }}>
      <Typography variant="h6" component="span" color="textSecondary">
        {children}
      </Typography>
    </DialogTitle>
  );
}

export default DialogTitles;
