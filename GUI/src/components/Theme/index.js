import React, { memo } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { connect } from 'dva';
import _ from 'lodash';
import themes from './theme.js';

const IVHTheme = memo(({ children, global }) => {
  // A custom theme for this app
  const Theme = createMuiTheme(_.get(themes, global.theme, 'Violet.DARK_THEME'));
  return <ThemeProvider theme={Theme}>{children}</ThemeProvider>;
});

export default connect(({ global }) => ({ global }))(IVHTheme);
