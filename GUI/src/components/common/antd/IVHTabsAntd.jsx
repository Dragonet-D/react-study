import React from 'react';
import { Tabs } from 'antd';
import C from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => {
  const textSecondary = theme.palette.text.secondary;
  const textPrimary = theme.palette.text.primary;
  return {
    table: {
      color: textPrimary
    },
    '@global': {
      '.ant-tabs .ant-tabs-left-bar .ant-tabs-tab': {
        color: textPrimary
      },
      '.ant-tabs-nav .ant-tabs-tab:hover': {
        color: textSecondary
      },
      '.ant-tabs-nav .ant-tabs-tab-active': {
        color: `${textSecondary}!important`
      }
    }
  };
});

function IVHTabsAntd(props) {
  const classes = useStyles();
  const { className, ...rest } = props;

  return <Tabs className={C(classes.table, className)} {...rest} />;
}

export default IVHTabsAntd;
