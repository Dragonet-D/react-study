import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

const styles = theme => ({
  th: {
    padding: 0,
    fontWeight: 'bold',
    textAlign: 'left',
    verticalAlign: 'middle',
    maxWidth: '100px',
    width: '100px',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    fontSize: _.get(theme, 'typography.subtitle2.fontSize', 'inherit'),
    // textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: theme.palette.text.secondary,
    position: 'sticky',
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
    top: 0
  }
});

const TableTh = ({ classes, className, width, ...rest }) => {
  return (
    <TableCell
      style={{ width, maxWidth: width }}
      className={classNames(className, classes.th)}
      {...rest}
    />
  );
};

TableTh.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TableTh);
