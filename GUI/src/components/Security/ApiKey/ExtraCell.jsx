import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Delete from '@material-ui/icons/Delete';
import Link from '@material-ui/icons/Link';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { I18n } from 'react-i18nify';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

function ExtraCell(props) {
  const { openEdit, openConfirm, openAssignGroup, openAssignRole, item, generateApiKey } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <React.Fragment>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            openEdit();
            handleClose();
          }}
        >
          <ListItemIcon style={{ minWidth: 40 }}>
            <Edit />
          </ListItemIcon>
          <ListItemText primary={I18n.t('global.button.edit')} />
        </MenuItem>
        {/* {!item.apikey && ( */}
        <MenuItem
          onClick={() => {
            generateApiKey();
            handleClose();
          }}
        >
          <ListItemIcon style={{ minWidth: 40 }}>
            <Link />
          </ListItemIcon>
          <ListItemText primary={I18n.t('security.apiKey.generateApiKey')} />
        </MenuItem>
        {/* )} */}
        {item.targetSystem === 'UMMI' && (
          <MenuItem
            onClick={() => {
              openAssignGroup();
              handleClose();
            }}
          >
            <ListItemIcon style={{ minWidth: 40 }}>
              <SupervisedUserCircle />
            </ListItemIcon>
            <ListItemText primary={I18n.t('security.apiKey.assignGroup')} />
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            openAssignRole();
            handleClose();
          }}
        >
          <ListItemIcon style={{ minWidth: 40 }}>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary={I18n.t('security.apiKey.assignRole')} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            openConfirm();
            handleClose();
          }}
        >
          <ListItemIcon style={{ minWidth: 40 }}>
            <Delete />
          </ListItemIcon>
          <ListItemText primary={I18n.t('global.button.delete')} />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
export default ExtraCell;
