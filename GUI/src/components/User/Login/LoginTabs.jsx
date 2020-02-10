import React, { Fragment, useState } from 'react';
import { I18n } from 'react-i18nify';
import { makeStyles } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import LoginForm from './LoginForm';
import LoginAD from './LoginAD';
import LoginADFS from './LoginADFS';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.spacing(40),
    height: theme.spacing(5),
    marginLeft: theme.spacing(1.25)
  },
  tabsRoot: {
    minHeight: theme.spacing(5)
  },
  tabRoot: {
    minWidth: theme.spacing(9),
    minHeight: theme.spacing(4),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:focus': {},
    '&:hover': {},
    '&$tabSelected': {
      fontWeight: theme.typography.fontWeightMedium
    }
  },
  tabSelected: {}
}));

const LoginTabs = props => {
  const classes = useStyles();
  const [tabsValue, setTabsValue] = useState(0);

  const handleTabsChangeEvent = (event, value) => {
    setTabsValue(value);
  };

  return (
    <Fragment>
      <div className={classes.root}>
        <Tabs
          value={tabsValue}
          onChange={handleTabsChangeEvent}
          indicatorColor="secondary"
          textColor="secondary"
          classes={{ root: classes.tabsRoot }}
        >
          <Tab
            disableRipple
            classes={{
              root: classes.tabRoot,
              selected: classes.tabSelected
            }}
            label={I18n.t('user.login.tabs.normal')}
          />
          <Tab
            disableRipple
            classes={{
              root: classes.tabRoot,
              selected: classes.tabSelected
            }}
            label={I18n.t('user.login.tabs.ad')}
          />
          <Tab
            disableRipple
            classes={{
              root: classes.tabRoot,
              selected: classes.tabSelected
            }}
            label={I18n.t('user.login.tabs.adfs')}
          />
        </Tabs>
      </div>
      {tabsValue === 0 && <LoginForm {...props} />}
      {tabsValue === 1 && <LoginAD {...props} />}
      {tabsValue === 2 && <LoginADFS {...props} />}
    </Fragment>
  );
};

export default LoginTabs;
