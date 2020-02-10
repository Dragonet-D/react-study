import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: 'flex',
      paddingRight: '8px'
    },
    btns: {
      marginLeft: 'auto'
    }
  };
});

function TableHeaderAction(props) {
  const classes = useStyles();
  const { handleAction, headerActionSetting } = props;

  return (
    <div className={classes.wrapper}>
      <div className={classes.btns}>
        {headerActionSetting.map(action => (
          <Button onClick={() => handleAction(action.action)}>{action.title}</Button>
        ))}
      </div>
    </div>
  );
}

TableHeaderAction.defaultProps = {
  handleAction: () => {},
  headerActionSetting: []
};

TableHeaderAction.propTypes = {
  handleAction: PropTypes.func,
  headerActionSetting: PropTypes.array
};

export default TableHeaderAction;
