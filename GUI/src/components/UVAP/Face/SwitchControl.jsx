import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => {
  return {
    trigger: {
      minWidth: '166px',
      display: 'flex',
      justifyContent: 'center',
      color: theme.palette.text.primary
    },
    trigger_active: {
      color: theme.palette.text.secondary
    }
  };
});

function SwitchControl({ trigger, handleTrigger, label }) {
  const classes = useStyles();
  return (
    <FormControl className={`${classes.trigger} ${trigger && classes.trigger_active}`}>
      <FormControlLabel
        checked={trigger}
        onChange={handleTrigger}
        value={label}
        control={<Switch color="primary" />}
        label={label}
        labelPlacement="start"
      />
    </FormControl>
  );
}

SwitchControl.defaultProps = {
  handleTrigger: () => {},
  label: ''
};

export default SwitchControl;
