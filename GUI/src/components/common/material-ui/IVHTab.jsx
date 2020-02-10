import { withStyles } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import React from 'react';

const IVHTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    minWidth: theme.spacing(9),
    minHeight: theme.spacing(4),
    color: theme.palette.text.primary,
    fontWeight: 550,
    '&$tabSelected': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '&:hover': {
      color: theme.palette.text.secondary,
      opacity: 1
    },
    '&$selected': {
      color: theme.palette.text.secondary
    },
    '&:focus': {
      color: theme.palette.text.secondary
    }
  },
  selected: {}
}))(props => <Tab disableRipple {...props} />);

export default IVHTab;
