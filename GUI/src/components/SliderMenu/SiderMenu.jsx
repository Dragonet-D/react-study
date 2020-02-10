import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu } from 'antd';
import pathToRegexp from 'path-to-regexp';
import C from 'classnames';
import * as icons from '@material-ui/icons';
import { router } from 'dva';
import { makeStyles } from '@material-ui/core/styles';
import styles from './SliderMenu.module.less';

const { Sider } = Layout;
const { SubMenu } = Menu;
const { Link } = router;

function urlToList(url) {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((urlItem, index) => {
    return `/${urllist.slice(0, index + 1).join('/')}`;
  });
}

export const getMeunMatcheys = (flatMenuKeys, path) => {
  return flatMenuKeys.filter(item => {
    return pathToRegexp(item).test(path);
  });
};

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menus
 */
export const getFlatMenuKeys = menus => {
  let keys = [];
  menus.forEach(item => {
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
    keys.push(item.path);
  });
  return keys;
};

const useStyles = makeStyles(theme => {
  const selectedBackgroundColor = theme.palette.background.default;
  const mainTextColor = theme.palette.text.primary;
  const hintTextColor = theme.palette.text.hint;
  const backGroundPaper = theme.palette.background.paper;
  return {
    '@global': {
      '.ant-tooltip': {
        zIndex: 1701,
        color: `${mainTextColor}!important`
      },
      '.ant-tooltip .ant-tooltip-arrow': {
        borderBottomColor: `${backGroundPaper}!important`,
        borderLeftColor: `${backGroundPaper}!important`
      },
      '.ant-tooltip .ant-tooltip-inner': {
        backgroundColor: `${backGroundPaper}!important`,
        color: mainTextColor
      },
      '.ant-tooltip-placement-bottom .ant-tooltip-arrow, .ant-tooltip-placement-bottomLeft .ant-tooltip-arrow, .ant-tooltip-placement-bottomRight .ant-tooltip-arrow': {
        borderTopColor: backGroundPaper
      },
      '.ant-tooltip-placement-top .ant-tooltip-arrow, .ant-tooltip-placement-topLeft .ant-tooltip-arrow, .ant-tooltip-placement-topRight .ant-tooltip-arrow': {
        borderRightColor: backGroundPaper
      },
      '.ant-menu-inline-collapsed-tooltip a': {
        color: mainTextColor
      },
      '.ant-menu-submenu-popup': {
        zIndex: 1701
      },
      '.ant-menu-dark': {
        background: 'transparent'
      },
      '.ant-menu-submenu .ant-menu-submenu-inline .ant-menu-submenu-open .ant-menu-submenu-selected': {
        background: 'transparent'
      },
      '.ant-menu .ant-menu-sub .ant-menu-inline': {
        background: 'transparent'
      },
      '.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title': {
        paddingLeft: `${theme.spacing(3)}px!important`
      },
      '.ant-menu-dark .ant-menu-inline.ant-menu-sub': {
        background: 'transparent',
        boxShadow: 'none'
      },
      '.ant-menu-submenu-title .ant-menu-submenu-arrow::before, .ant-menu-submenu-title .ant-menu-submenu-arrow::after': {
        background: `${theme.palette.text.primary}!important`
      },
      '.ant-menu.ant-menu-dark .ant-menu-item-selected, .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected': {
        color: mainTextColor,
        backgroundColor: selectedBackgroundColor
      },
      '.ant-menu-inline-collapsed > .ant-menu-item': {
        padding: `0 ${theme.spacing(3)}px !important`
      },
      '.ant-menu.ant-menu-dark .ant-menu-item-selected > a, .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected > a': {
        color: mainTextColor,
        backgroundColor: selectedBackgroundColor
      },
      '.ant-menu-dark .ant-menu-submenu-selected': {
        color: mainTextColor,
        backgroundColor: props => {
          return props.collapsed ? selectedBackgroundColor : '';
        },
        fontWeight: 600
      },
      '.ant-menu-dark .ant-menu-item:hover': {
        color: mainTextColor,
        backgroundColor: selectedBackgroundColor
      },
      '.ant-menu-dark .ant-menu-item:hover, .ant-menu-dark .ant-menu-submenu-title:hover': {
        color: mainTextColor,
        backgroundColor: selectedBackgroundColor
      },
      '.ant-menu-submenu-active': {
        color: mainTextColor
      },
      '.ant-menu-dark, .ant-menu-dark .ant-menu-sub': {
        backgroundColor: theme.palette.background.paper,
        color: hintTextColor,
        fontWeight: 600
      },
      '.ant-menu-dark .ant-menu-item, .ant-menu-dark .ant-menu-item > a': {
        color: hintTextColor
      },
      '.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open': {
        color: hintTextColor
      }
    },
    wrapper: {
      background: 'transparent'
    },
    open: {
      minWidth: `${50}px!important`,
      maxWidth: `${50}px!important`
    },
    close: {
      minWidth: `${240}px!important`,
      maxWidth: `${240}px!important`
    },
    item_text: {
      // color: theme.palette.text.primary,
      fontWeight: 600
    },
    icon: {
      color: theme.palette.text.secondary,
      marginLeft: '-10px',
      marginRight: '11px'
    },
    icon_close: {
      color: theme.palette.text.secondary,
      marginLeft: '-10px',
      marginRight: '18px'
    }
  };
});

function SiderMenu(props) {
  const { menuData, location, collapsed, onCollapse, isMobile, Authorized } = props;
  const flatMenuKeys = getFlatMenuKeys(menuData);
  const classes = useStyles(props);
  const menus = menuData;

  /**
   * Convert pathname to openKeys
   * /list/search/articles = > ['list','/list/search']
   */
  const getDefaultCollapsedSubMenus = useCallback(() => {
    return urlToList(location.pathname)
      .map(item => {
        return getMeunMatcheys(flatMenuKeys, item)[0];
      })
      .filter(item => item);
  }, [flatMenuKeys, location.pathname]);

  const [openKeys, setOpenKeys] = useState(getDefaultCollapsedSubMenus(props));
  const [pathnameState, setPathnameState] = useState(location.pathname);

  useEffect(() => {
    if (pathnameState !== location.name) {
      setOpenKeys(getDefaultCollapsedSubMenus(props));
      setPathnameState(location.name);
    }
  }, [getDefaultCollapsedSubMenus, location.name, pathnameState, props]);

  /**
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  const getMenuItemPath = item => {
    const itemPath = conversionPath(item.path);
    const { target, name, icon } = item;
    const Icon = icon ? icons[icon] : '';
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          <div className={styles.item_wrapper}>
            {Icon && <Icon className={`${collapsed ? classes.icon_close : classes.icon}`} />}
            <span className={classes.item_text}>{item.name}</span>
          </div>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={isMobile && onCollapse(true)}
      >
        <div className={styles.item_wrapper}>
          {Icon && <Icon className={`${collapsed ? classes.icon_close : classes.icon}`} />}
          <span className={classes.item_text}>{name}</span>
        </div>
      </Link>
    );
  };

  /**
   * get SubMenu or Item
   */
  const getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      const isIcon = item.icon;
      const Icon = isIcon ? icons[isIcon] : '';
      return (
        <SubMenu
          title={
            item.icon ? (
              <div className={styles.item_wrapper}>
                {Icon && <Icon className={`${collapsed ? classes.icon_close : classes.icon}`} />}
                <span className={classes.item_text}>{item.name}</span>
              </div>
            ) : (
              item.name
            )
          }
          key={item.path}
        >
          {getNavMenuItems(item.children)}
        </SubMenu>
      );
    } else {
      return <Menu.Item key={item.path}>{getMenuItemPath(item)}</Menu.Item>;
    }
  };

  /**
   * get the menu child
   * @memberof SiderMenu
   */
  const getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        const ItemDom = getSubMenuOrItem(item);
        return checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };

  // Get the currently selected menu
  const getSelectedMenuKeys = () => {
    return urlToList(location.pathname).map(itemPath =>
      getMeunMatcheys(flatMenuKeys, itemPath).pop()
    );
  };

  // transfer path
  const conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  };

  // permission to check
  const checkPermissionItem = (authority, ItemDom) => {
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  const isMainMenu = key => {
    return menus.some(item => key && (item.key === key || item.path === key));
  };

  const handleOpenChange = openKeys => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const moreThanOne = openKeys.filter(openKey => isMainMenu(openKey)).length > 1;
    setOpenKeys(moreThanOne ? [lastOpenKey] : [...openKeys]);
  };

  // Don't show popup menu when it is been collapsed
  const menuProps = collapsed ? {} : { openKeys };
  // if pathname can't match, use the nearest parent's key
  let selectedKeys = getSelectedMenuKeys();
  if (!selectedKeys.length) {
    selectedKeys = [openKeys[openKeys.length - 1]];
  }
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      onCollapse={onCollapse}
      width={240}
      collapsedWidth={60}
      className={C(classes.wrapper, collapsed ? classes.open : classes.close)}
    >
      <Menu
        key="Menu"
        theme="dark"
        mode="inline"
        inlineIndent={24}
        {...menuProps}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={{ padding: '0', width: '100%' }}
      >
        {getNavMenuItems(menus)}
      </Menu>
    </Sider>
  );
}

export default SiderMenu;
