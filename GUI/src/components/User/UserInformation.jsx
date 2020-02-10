import React, { useState, useCallback } from 'react';
import { routerRedux } from 'dva';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import {
  getUserInformation,
  getUserIdentify,
  getApprovalRequest,
  getPendingRequest
} from 'utils/getUserInformation';
import { BorderColor, PowerOff, CheckCircle } from '@material-ui/icons';
import SettingsIcon from '@material-ui/icons/Settings';
import store from '@/index';
import { I18n } from 'react-i18nify';
import { ConfirmPage } from 'components/common';
import UserChangePassword from './UserChangePassword';
import UserProfile from './UserProfile';
import Settings from './Settings';

const useStyles = makeStyles(theme => {
  return {
    user_info: {
      height: '100%',
      paddingRight: theme.spacing(3),
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      color: theme.palette.text.secondary
    },
    wrapper: {
      position: 'relative',
      height: '100%'
    },
    dropdown_list: {
      position: 'absolute',
      width: theme.spacing(30),
      right: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
      zIndex: 1400
    },
    list_item: {
      paddingTop: 0,
      paddingBottom: 0,
      minHeight: theme.spacing(5),
      fontSize: 'inherit',
      color: theme.palette.text.secondary
    },
    badge: {
      top: 3,
      right: -3
    },
    noBadge: {
      top: 0,
      right: -5,
      height: 8,
      width: 8,
      display: 'none'
    },
    badgePaddingLeft: {
      paddingLeft: 4
    }
  };
});

const information = [
  {
    icon: <CheckCircle />,
    name: I18n.t('global.button.approveAccess'),
    alias: 'approveAccess'
  },
  {
    icon: <BorderColor />,
    name: I18n.t('global.button.changePassword'),
    alias: 'changePassword'
  },
  {
    icon: <BorderColor />,
    name: I18n.t('global.button.updateUserProfile'),
    alias: 'updateUserProfile'
  },
  {
    icon: <SettingsIcon />,
    name: I18n.t('global.button.settings'),
    alias: 'settings'
  },
  {
    icon: <PowerOff />,
    name: I18n.t('global.button.logout'),
    alias: 'logout'
  }
];

function UserInformation(props) {
  const classes = useStyles();
  const { userInfo } = props;
  const [collapseStatus, setCollapseStatus] = useState(false);
  const [passwordDialogStatus, setPasswordDialogStatus] = useState(false);
  const [profileDialogStatus, setProfileDialogStatus] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const userRoleName = getUserInformation().roleName;
  const approvalRequest = getApprovalRequest();
  const pendingRequest = getPendingRequest();
  const isShowPending = pendingRequest > 0;
  const badgeStatus = approvalRequest && isShowPending;

  const menuFuncs = {
    logout() {
      setOpenLogoutDialog(true);
    },
    changePassword() {
      setPasswordDialogStatus(true);
    },
    updateUserProfile() {
      setProfileDialogStatus(true);
    },
    approveAccess() {
      store.dispatch(routerRedux.push('/uvms/approveAccess'));
    },
    settings() {
      setSettingsStatus(true);
    }
  };

  const invokeSettingClose = useCallback(() => {
    setSettingsStatus(false);
  }, []);

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className={classes.wrapper}>
          <Typography component="h5" className={classes.user_info} onClick={toggleCollapse}>
            {`${userRoleName}: `}
            <Badge
              color="error"
              variant="dot"
              className={classes.badgePaddingLeft}
              classes={{
                badge: badgeStatus ? classes.badge : classes.noBadge
              }}
            >
              {userInfo.userFullName || ''}
            </Badge>
          </Typography>
          <Paper>
            <Collapse in={collapseStatus} className={classes.dropdown_list}>
              <MenuList>
                {information.map(item => (
                  <MenuItem
                    className={classes.list_item}
                    key={item.name}
                    onClick={handleMenuItemcClickEvent.bind(null, item.alias)}
                  >
                    <ListItemIcon>{getItemIcon(item)}</ListItemIcon>
                    {item.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Collapse>
          </Paper>
        </div>
      </ClickAwayListener>
      {settingsStatus && (
        <Settings
          open={settingsStatus}
          handleClose={invokeSettingClose}
          title={I18n.t('global.button.settings')}
        />
      )}
      <UserChangePassword
        openChangePwdDialog={passwordDialogStatus}
        handleChangePwdDialogClose={handlePasswordDialogClose}
      />
      <UserProfile
        openChangeProfileDialog={profileDialogStatus}
        handleChangeProfileDialogClose={handleChangeProfileDialogClose}
      />
      <ConfirmPage
        message="Confirm to logout?"
        messageTitle="Logout"
        isConfirmPageOpen={openLogoutDialog}
        hanldeConfirmMessage={confirmToLogoutSystem}
        handleConfirmPageClose={closeLogoutDialog}
      />
    </>
  );

  function getItemIcon(item) {
    if (item.alias === 'approveAccess' && badgeStatus) {
      return (
        <Badge
          color="error"
          badgeContent={pendingRequest || 0}
          classes={{
            badge: classes.badge
          }}
        >
          {item.icon}
        </Badge>
      );
    }
    return item.icon;
  }

  function handleClickAway() {
    setCollapseStatus(false);
  }

  function toggleCollapse() {
    setCollapseStatus(collapse => !collapse);
  }

  function handleMenuItemcClickEvent(name) {
    if (menuFuncs[name]) {
      menuFuncs[name]();
    }
    handleClickAway();
  }

  // password
  function handlePasswordDialogClose() {
    setPasswordDialogStatus(false);
  }

  // profile
  function handleChangeProfileDialogClose() {
    setProfileDialogStatus(false);
  }

  // close logout dialog
  function closeLogoutDialog() {
    setOpenLogoutDialog(false);
  }

  function confirmToLogoutSystem() {
    const user = getUserIdentify();
    const auditUuid = user && user.auditLogId;
    const userId = user && user.userInfo && user.userInfo.userId;
    if (auditUuid) {
      store.dispatch({
        type: 'global/logout',
        payload: {
          auditUuid,
          userId
        }
      });
    }

    setOpenLogoutDialog(false);
  }
}

export default UserInformation;
