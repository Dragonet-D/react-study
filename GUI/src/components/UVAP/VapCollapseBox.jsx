import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Loading } from 'components/Loading';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles(() => ({
  search_control: {
    flex: '1',
    paddingLeft: '8px'
  },
  wrapper: {
    display: 'flex'
  }
}));

function VapCollapseBox(props) {
  const classes = useStyles();
  const { children, filterStatus, loading } = props;
  return (
    <div className={classes.wrapper}>
      {loading && (
        <div className={classes.loading}>
          <Loading size="small" />
        </div>
      )}
      <Collapse in={filterStatus} className={classes.search_control}>
        {children}
      </Collapse>
    </div>
  );
}

VapCollapseBox.defaultProps = {
  filterStatus: true,
  loading: false
};

VapCollapseBox.propTypes = {
  filterStatus: PropTypes.bool,
  loading: PropTypes.bool
};

export default VapCollapseBox;
