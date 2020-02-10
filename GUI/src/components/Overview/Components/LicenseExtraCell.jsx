import React from 'react';
import { ToolTip } from 'components/common';
import IconButton from '@material-ui/core/IconButton';
import PieChart from '@material-ui/icons/PieChart';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { I18n } from 'react-i18nify';
import { CloudUpload } from '@material-ui/icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

function ExtraCell(props) {
  const { itemData, showTable, openUploadPage } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <React.Fragment>
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
            showTable(itemData);
            handleClose();
          }}
        >
          <ListItemIcon style={{ minWidth: 40 }}>
            <PieChart />
          </ListItemIcon>
          <ListItemText primary={I18n.t('overview.button.adjust')} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            openUploadPage(itemData);
            handleClose();
          }}
        >
          <ListItemIcon style={{ minWidth: 40 }}>
            <CloudUpload />
          </ListItemIcon>
          <ListItemText primary={I18n.t('global.button.upload')} />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
export default ExtraCell;
