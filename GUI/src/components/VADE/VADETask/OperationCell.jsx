import React from 'react';
import { ToolTip } from 'components/common';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import CloudDownload from '@material-ui/icons/CloudDownload';
import { I18n } from 'react-i18nify';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';

function ExtraCell(props) {
  const { handleDoTask, downloadFile, itemData, openEditPage, openLogPage } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function doTask() {
    handleDoTask();
  }

  return (
    <React.Fragment>
      <ToolTip
        title={(() => {
          const con1 = itemData.taskStatus === 'Completed';
          const con2 = itemData.taskStatus === 'Running';
          const end = I18n.t('vade.button.end');
          const begin = I18n.t('vade.button.begin');
          return con1 ? ' ' : con2 ? end : begin;
        })()}
      >
        <Switch
          disabled={itemData.taskStatus === 'Completed'}
          checked={itemData.taskStatus === 'Running'}
          onChange={doTask}
        />
      </ToolTip>
      <ToolTip title={I18n.t('global.button.more')}>
        <IconButton
          aria-label={I18n.t('global.button.more')}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
      </ToolTip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            openEditPage(itemData);
            handleClose();
          }}
          disabled={
            itemData.taskStatus !== 'Waiting to start' &&
            itemData.taskStatus !== 'Stopped' &&
            itemData.taskStatus !== 'Error'
          }
        >
          <ListItemIcon style={{ minWidth: 40 }}>
            <Edit />
          </ListItemIcon>
          <ListItemText primary={I18n.t('global.button.edit')} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            openLogPage(itemData);
            handleClose();
          }}
          disabled={itemData.taskStatus !== 'Running'}
        >
          <ListItemIcon style={{ minWidth: 40 }}>
            <RemoveRedEye />
          </ListItemIcon>
          <ListItemText primary={I18n.t('vade.button.taskLog')} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            downloadFile(itemData);
            handleClose();
          }}
          disabled={itemData.taskStatus === 'Waiting to start'}
        >
          <ListItemIcon style={{ minWidth: 40 }}>
            <CloudDownload />
          </ListItemIcon>
          <ListItemText primary={I18n.t('vade.button.downloadLog')} />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
export default ExtraCell;
