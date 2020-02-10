import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(() => {
  return {
    container: {
      height: '50px',
      width: '100%',
      display: 'flex',
      paddingRight: '8px',
      alignItems: 'center',
      flexDirection: 'row-reverse'
    },
    buttonGroup: {}
  };
});
function DeviceActionBar(props) {
  const { buttonAction } = props;
  const classes = useStyle();

  return (
    <div className={classes.container}>
      <div className={classes.buttonGroup}>
        <Button
          onClick={() => {
            buttonAction('UpdateDevice');
          }}
        >
          Update Device
        </Button>
      </div>
    </div>
  );
}

export default DeviceActionBar;
