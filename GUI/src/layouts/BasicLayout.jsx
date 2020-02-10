import React, { useState } from 'react';
import clsx from 'clsx';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import { FormatIndentDecrease, FormatIndentIncrease } from '@material-ui/icons';
import { connect, router, routerRedux } from 'dva';
import DocumentTitle from 'react-document-title';
import { getRoutes } from 'utils/utils';
import Authorized from 'utils/Authorized';
import { getMenuData } from 'commons/menu';
import SiderMenu from 'components/SliderMenu';
import { UserInformation } from 'components/User';
import { Loading } from 'components/Loading';
import { BasicLayoutTitle, ScrollBar } from 'components/common';
import store from '@/index';

import styles from './BasicLayout.module.less';

const { Route, Redirect, Switch } = router;
const drawerWidth = 240;
const { AuthorizedRoute } = Authorized;
const useStyles = makeStyles(theme => {
  const drawerClosedSize = `${theme.spacing(7)}px`;
  return {
    wrapper: {
      display: 'flex',
      height: '100%'
    },
    toolbar: {
      paddingRight: 24 // keep right padding when drawer closed
    },
    drawerPaper: {
      overflow: 'hidden',
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      backgroundColor: theme.palette.background.paper
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: drawerClosedSize,
      backgroundColor: theme.palette.background.paper
    },
    main: {
      flexGrow: 1,
      height: '100vh',
      position: 'relative'
    },
    container: {
      padding: theme.spacing(1),
      height: `calc(100% - ${drawerClosedSize})`,
      background: 'url(/static/media/bg.png) center',
      position: 'relative'
    },
    content: {
      width: '100%',
      minHeight: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: props => {
        return props.pureContainer ? 'transparent' : theme.palette.background.paper;
      }
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column'
    },
    expend_button: {
      color: theme.palette.text.secondary,
      width: theme.spacing(6),
      height: theme.spacing(6)
    },
    app_bar: {
      height: drawerClosedSize,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'none'
    },
    logo_wrapper: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: drawerClosedSize,
      cursor: 'pointer'
    },
    logo: {
      width: drawerClosedSize,
      height: drawerClosedSize,
      padding: theme.spacing(1),
      '& img': {
        width: theme.spacing(5),
        height: theme.spacing(5)
      }
    },
    icon_name: {
      color: theme.palette.text.primary,
      flex: 1
    }
  };
});

const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

function BasicLayout(props) {
  const { routerData, match, location, global, loading } = props;
  const { userInfo } = global;
  const theme = useTheme();
  const isLogged = !!userInfo;
  const classes = useStyles(routerData[location.pathname]);
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function onCollapse(e) {
    setOpen(e);
  }

  function getBashRedirect() {
    // According to the url parameter to redirect
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      return '/home';
    }
    return redirect;
  }

  function getPageName() {
    const pathInfo = routerData[location.pathname];
    if (pathInfo && pathInfo.noTitle) {
      return '';
    }
    return pathInfo ? pathInfo.name || '' : '';
  }

  function getPageTitle() {
    const { pathname } = location;
    let title = 'IVH';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - IVH`;
    }
    return title;
  }

  function isLoading() {
    const pathInfo = routerData[location.pathname];
    return !(pathInfo && pathInfo.noLoading);
  }

  function handleGoHome() {
    store.dispatch(routerRedux.push('/home'));
  }

  const bashRedirect = getBashRedirect();
  const titleName = getPageName();
  const isGlobalLoadingNotNeeded = isLoading();
  return (
    <DocumentTitle title={getPageTitle()}>
      <div className={classes.wrapper}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
          }}
          open={open}
        >
          <div className={`${styles.toolbar_icon} ${open ? styles.toolbar_icon_active : ''}`}>
            <div className={classes.logo_wrapper} onClick={handleGoHome}>
              <div className={classes.logo}>
                <img src="/static/media/IVH.logo.png" alt="IVH" />
              </div>
              {open && <div className={classes.icon_name}>INTEGRATED VIDEO HUB</div>}
            </div>
          </div>
          <Divider />
          <ScrollBar style={{ overflow: 'hidden' }}>
            <SiderMenu
              expand={open}
              location={location}
              menuData={getMenuData()}
              Authorized={Authorized}
              onCollapse={onCollapse}
              collapsed={!open}
            />
          </ScrollBar>
        </Drawer>
        <main className={classes.main}>
          {isGlobalLoadingNotNeeded && loading.global && <Loading />}
          <AppBar position="static" color="inherit" className={classes.app_bar}>
            <Typography variant="h6" color="inherit">
              {open ? (
                <IconButton
                  color="primary"
                  onClick={handleDrawerClose}
                  className={classes.expend_button}
                >
                  <FormatIndentDecrease />
                </IconButton>
              ) : (
                <IconButton
                  color="primary"
                  onClick={handleDrawerOpen}
                  className={classes.expend_button}
                >
                  <FormatIndentIncrease />
                </IconButton>
              )}
            </Typography>
            <UserInformation userInfo={userInfo} />
          </AppBar>
          <div className={classes.container}>
            <ScrollBar className={classes.content}>
              {titleName && <BasicLayoutTitle titleName={titleName} />}
              <Switch>
                {redirectData.map(item => (
                  <Redirect key={item.from} exact from={item.from} to={item.to} />
                ))}
                {getRoutes(match.path, routerData).map(item => (
                  <AuthorizedRoute
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                    authority={item.authority}
                    redirectPath={isLogged ? '/exception/403' : '/user/login'}
                    theme={theme}
                    global={global}
                  />
                ))}
                <Redirect exact from="/" to={bashRedirect} />
                <Route exact path="/exception/404" />
              </Switch>
            </ScrollBar>
          </div>
        </main>
      </div>
    </DocumentTitle>
  );
}

export default connect(({ global, loading }) => ({
  global,
  loading
}))(BasicLayout);
