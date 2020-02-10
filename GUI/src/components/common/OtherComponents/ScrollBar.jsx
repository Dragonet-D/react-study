import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  '@global': {
    '.scroll_bar_horizontal': {
      borderRadius: 20,
      background: theme.palette.scrollBar.scrollBar,
      display: 'none!important'
    },
    '.scroll_bar_vertical': {
      borderRadius: 20,
      background: theme.palette.scrollBar.scrollBar
    }
  }
});
/**
 *
 *
 * @param {*} { children,classes, ...props }
 */
const ScrollBar = ({ children, classes, ...props }) => (
  <Scrollbars
    autoHide
    {...props}
    renderThumbHorizontal={prop => <div className="scroll_bar_horizontal" {...prop} />}
    renderThumbVertical={prop => <div className="scroll_bar_vertical" {...prop} />}
  >
    {children}
  </Scrollbars>
);
ScrollBar.defaultProps = {};
ScrollBar.propTypes = {};
export default withStyles(styles)(ScrollBar);
