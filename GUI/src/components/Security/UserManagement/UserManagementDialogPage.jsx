import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import { withStyles, Dialog as DialogInitial, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { DialogTitle as DialogTitleInitial } from 'components/common';

/**
 * @description rewrited Dialog
 * @export Dialog
 */
const dialogStyles = () => ({
  root: {}
});

const Dlg = ({ classes, className, children, ...props }) => {
  return (
    <DialogInitial className={ClassNames(classes.root, className)} {...props}>
      {children}
    </DialogInitial>
  );
};

Dlg.propTypes = {
  classes: PropTypes.object.isRequired
};

export const Dialog = withStyles(dialogStyles)(Dlg);

/**
 * @description rewrited DialogTitle
 * @export DialogTitle
 */
const dialogTitleStyles = () => ({
  root: {},
  closePosition: {
    position: 'absolute',
    right: 0,
    top: 0
  }
});

const DlgTitle = ({ classes, className, children, onClick, ...props }) => {
  return (
    <DialogTitleInitial className={ClassNames(classes.root, className)} {...props}>
      {children}
      <IconButton className={classes.closePosition} onClick={onClick}>
        <Close />
      </IconButton>
    </DialogTitleInitial>
  );
};

DlgTitle.propTypes = {
  classes: PropTypes.object.isRequired
};

export const DialogTitle = withStyles(dialogTitleStyles)(DlgTitle);
