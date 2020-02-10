import React, { useEffect } from 'react';
import { Button, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import store from '@/index';

const useStyles = makeStyles(() => ({
  iconStart: {
    marginRight: 10
  },
  iconEnd: {
    marginRight: 10,
    marginLeft: 10
  },
  inputMargin: {
    marginTop: 5
  },
  submitButton: {
    textTransform: 'none'
  },
  iconError: {
    color: 'red'
  },
  iconSuccess: {
    color: '#00e676'
  }
}));

export default function LoginForm(props) {
  const {
    user: { adfsLoginUrl }
  } = props;
  const classes = useStyles();

  useEffect(() => {
    store.dispatch({
      type: 'user/initIdpDataOfADFS'
    });
  }, []);

  function handleClick() {
    window.location.href = adfsLoginUrl;
  }

  return (
    <FormControl fullWidth className={classes.inputMargin}>
      <Button
        id="btnSignIn"
        variant="contained"
        size="medium"
        color="primary"
        onClick={handleClick}
        className={classes.submitButton}
        disabled={!adfsLoginUrl}
      >
        {!adfsLoginUrl ? 'Initializing ADFS...' : 'Go To ADFS'}
      </Button>
    </FormControl>
  );
}
