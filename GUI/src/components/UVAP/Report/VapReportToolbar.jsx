import React, { useState } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import FilterList from '@material-ui/icons/FilterList';
import PropTypes from 'prop-types';
import * as icons from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  expansHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  filterContent: {
    padding: '20px 20px 10px',
    display: 'grid'
  }
}));
const MuiExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    cursor: 'default',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    }
  },
  expanded: {}
})(ExpansionPanel);
const MuiExpansionPanelSummary = withStyles({
  root: {
    // backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56
    },
    cursor: 'default'
  },
  content: {
    margin: '0 0',
    '&$expanded': {
      margin: '0 0'
    }
  },
  expanded: {}
})(ExpansionPanelSummary);

function VapReportToolbar(props) {
  const classes = useStyles();
  const { children, buttonRender, title, icon } = props;
  const [expanded, setExpanded] = useState(false);
  const ItemIcon = icon ? icons[icon] : null;
  return (
    <MuiExpansionPanel square expanded={expanded}>
      <MuiExpansionPanelSummary style={{ cursor: 'default' }}>
        <IconButton onClick={() => setExpanded(!expanded)}>
          {ItemIcon ? (
            <ItemIcon style={{ color: 'ffa517' }} />
          ) : (
            <FilterList style={{ color: 'ffa517' }} />
          )}
        </IconButton>
        <Typography className={classes.expansHeader}>{title || 'Filter'}</Typography>
        {buttonRender()}
      </MuiExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.filterContent}>{children}</ExpansionPanelDetails>
    </MuiExpansionPanel>
  );
}

VapReportToolbar.defaultProps = {
  buttonRender: () => {},
  title: '',
  icon: ''
};

VapReportToolbar.propTypes = {
  buttonRender: PropTypes.func,
  title: PropTypes.string,
  icon: PropTypes.string
};

export default VapReportToolbar;
