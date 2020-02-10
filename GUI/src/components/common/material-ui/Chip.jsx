import React from 'react';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

const styles = Theme => {
  const secondaryPaper = Theme.palette.background.paper;
  return {
    deleteIcon: {
      color: Theme.palette.secondary.main,
      '&:hover': {
        color: Theme.palette.secondary.main
      }
    },
    root: {
      background: Theme.palette.primary.light,
      color: Theme.palette.text.primary,
      '&:hover': {
        background: secondaryPaper
      },
      '&:active': {
        background: secondaryPaper
      }
    },
    deletable: {
      '&:focus': {
        background: secondaryPaper
      }
    },
    icon: {},
    label: {},
    avatar: {},
    clickable: {},
    colorPrimary: {},
    colorSecondary: {},
    iconColorPrimary: {},
    iconColorSecondary: {},
    deleteIconColorPrimary: {},
    deleteIconColorSecondary: {},
    deleteIconOutlinedColorPrimary: {},
    deleteIconOutlinedColorSecondary: {}
  };
};

const Chips = props => {
  const { undeletable } = props;
  return <Chip {...props} deleteIcon={undeletable ? <></> : <CloseIcon color="secondary" />} />;
};

export default withStyles(styles)(Chips);
