import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import * as icons from '@material-ui/icons';
import _ from 'lodash';
import { isPermissionHas } from 'components/common';

const OperationMenuItem = props => {
  const { item, setAnchor, getActionData, currentData } = props;
  const ItemIcon = icons[item.icon];
  let showStatus = true;
  if (_.isArray(item.data)) {
    showStatus =
      item.dataIndex && item.data
        ? _.indexOf(item.data, _.get(currentData, item.dataIndex)) >= 0
        : true;
  } else {
    showStatus =
      item.dataIndex && item.data ? _.get(currentData, item.dataIndex) === item.data : true;
  }
  if (item.materialKey) {
    showStatus = isPermissionHas(item.materialKey);
  }

  return (
    showStatus && (
      <MenuItem
        onClick={() => {
          getActionData(item.action || item.title, currentData);
          setAnchor(null);
        }}
      >
        {ItemIcon && (
          <ListItemIcon>
            <ItemIcon />
          </ListItemIcon>
        )}
        <ListItemText primary={`${item.title}`} />
      </MenuItem>
    )
  );
};

function OperationTableMenu(props) {
  const { columns, itemId, getActionData, currentData, disabled } = props;
  const [anchor, setAnchor] = useState(null);
  const MenuIcon = icons[columns.icon];
  const DefaultIcon = icons.MoreVert;
  const items = columns.items ? columns.items : [];

  const menuState = anchor ? anchor.id === itemId : false;
  return (
    <Fragment>
      <IconButton
        id={itemId}
        key={itemId}
        aria-label={columns.tipName}
        aria-owns={`operation-menu-${itemId}`}
        aria-haspopup="true"
        onClick={e => setAnchor(e.currentTarget)}
        disabled={disabled}
      >
        {columns.icon ? <MenuIcon /> : <DefaultIcon />}
      </IconButton>
      <Menu
        key={`menu-${itemId}`}
        id={`operation-menu-${itemId}`}
        anchorEl={anchor}
        open={menuState}
        onClose={() => setAnchor(null)}
        disableAutoFocusItem
        keepMounted
      >
        {items.map(item => (
          <OperationMenuItem
            item={item}
            setAnchor={setAnchor}
            key={`${item.title}-${itemId}`}
            itemId={itemId}
            getActionData={getActionData}
            currentData={currentData}
          />
        ))}
      </Menu>
    </Fragment>
  );
}

OperationTableMenu.defaultProps = {
  columns: {},
  currentData: {},
  itemId: '',
  getActionData: () => {},
  disabled: false
};
OperationTableMenu.propTypes = {
  columns: PropTypes.object,
  currentData: PropTypes.object,
  itemId: PropTypes.string,
  getActionData: PropTypes.func,
  disabled: PropTypes.bool
};

export default OperationTableMenu;
