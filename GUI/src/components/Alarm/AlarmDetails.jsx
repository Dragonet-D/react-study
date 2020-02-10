import React, { memo } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      width: '50vw'
    }
  };
});

const AlarmDetails = memo(props => {
  const classes = useStyles();
  const { handleClose, open, dataSource } = props;
  function handleDrawerClose() {
    handleClose();
  }

  return (
    <Drawer open={open} onClose={handleDrawerClose} variant="temporary">
      <div className={classes.wrapper}>
        {(() => {
          return Object.keys(dataSource).map(item => {
            return (
              <Typography key={item}>
                <span>{item}</span>
                <span>{dataSource[item]}</span>
              </Typography>
            );
          });
        })()}
      </div>
    </Drawer>
  );
});

AlarmDetails.defaultProps = {
  handleClose: () => {},
  open: false,
  dataSource: {}
};

AlarmDetails.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  dataSource: PropTypes.object
};

export default AlarmDetails;
