import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '@material-ui/core';

const styles = theme => ({
  cellSize: {
    height: '100%',
    width: '100%',
    padding: '15px 20px',
    textAlign: 'center',
    color: theme.palette.text.primary,
    borderBottom: 'none',
    fontSize: 13,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 50
  },
  rowSize: {
    height: 50,
    width: '100%',
    display: 'flex',
    '&:nth-of-type(even)': {
      backgroundColor: 'rgba(255,255,255,.02)'
    }
  },
  tableSize: {
    width: '100%'
  }
});

// table cell
function Cell({ classes, className, children, ...rest }) {
  return (
    <div className={classNames(className, classes.cellSize)} {...rest}>
      {children}
    </div>
  );
}

Cell.propTypes = {
  classes: PropTypes.object.isRequired
};

export const TabCell = withStyles(styles)(Cell);

// table row
function Row({ classes, className, children, ...rest }) {
  return (
    <div className={classNames(className, classes.rowSize)} {...rest}>
      {children}
    </div>
  );
}

Row.propTypes = {
  classes: PropTypes.object.isRequired
};

export const TabRow = withStyles(styles)(Row);

// table tbody
function Table({ classes, className, children, ...rest }) {
  return (
    <div className={classNames(className, classes.tableSize)} {...rest}>
      {children}
    </div>
  );
}

Table.propTypes = {
  classes: PropTypes.object.isRequired
};

export const Tab = withStyles(styles)(Table);

// ExpansionPanel
function ExpansionPl({ classes, className, children, ...rest }) {
  return (
    <ExpansionPanel className={classNames(className)} {...rest}>
      {children}
    </ExpansionPanel>
  );
}

ExpansionPl.propTypes = {
  classes: PropTypes.object.isRequired
};

export const ExpansionPanelC = withStyles(styles)(ExpansionPl);

// ExpansionPanelSummary
function ExpansionPanelSy({ classes, className, children, ...rest }) {
  return (
    <ExpansionPanelSummary className={classNames(className)} {...rest}>
      {children}
    </ExpansionPanelSummary>
  );
}

ExpansionPanelSy.propTypes = {
  classes: PropTypes.object.isRequired
};

export const ExpansionPanelSummaryC = withStyles(styles)(ExpansionPanelSy);

// ExpansionPanelDetails
function ExpansionPanelDls({ classes, className, children, ...rest }) {
  return (
    <ExpansionPanelDetails className={classNames(className)} {...rest}>
      {children}
    </ExpansionPanelDetails>
  );
}

ExpansionPanelDls.propTypes = {
  classes: PropTypes.object.isRequired
};

export const ExpansionPanelDetailsC = withStyles(styles)(ExpansionPanelDls);
