/*
 * @Description: Tree List Item
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-21 22:51:39
 * @LastEditTime: 2019-10-09 15:19:30
 * @LastEditors: Kevin
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Context from 'utils/createContext';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const useStyles = makeStyles(() => ({
  itemText: {
    padding: '4px 0 0',
    fontSize: 14
  },
  itemIcon: {
    minWidth: 0,
    padding: 0,
    marginRight: 5
  },
  listItem: ({ isSearched, level }) => ({
    paddingRight: 0,
    paddingLeft: (level - 1) * 18,
    backgroundColor: isSearched ? 'rgba(0,0,0,.15)' : 'unset'
  }),
  listItemDesen: {
    height: 26,
    paddingTop: 2,
    paddingBottom: 2
  },
  searchArea: {
    marginBottom: 5
  },
  scrollList: {
    overflow: 'auto',
    height: '100%',
    width: '100%'
  },
  listRoot: {
    whiteSpace: 'nowrap'
  },
  textEllipsis: {
    display: 'inline-block',
    maxWidth: 100,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));

export default function TreeListNodeItem(props) {
  const { data, visibility, onSetVisibility } = props;
  const isOpen = !!visibility[data.fullPath]; // used to open collapse
  const hasChildrenNodes = Array.isArray(data.children) && data.children.length > 0; // whether there are child nodes
  const isGroup = !!data && !!data.groupId && data.groupId.length > 0; // whether current node is group
  const isSearched = !!data.isSearched; // whether current node is searched
  const styleProps = {
    isSearched,
    level: data.groupLevel
  };
  const classes = useStyles(styleProps);
  const { TreeNode, NodeIcon, onSelectTreeNode, groupNode, singleNode } = useContext(Context); // custom tree node
  return (
    <ListItem
      key={data.fullPath}
      className={classes.listItem}
      classes={{
        dense: classes.listItemDesen
      }}
      button
      disableRipple
      onClick={handleListOpenClickEvent.bind(null, data, hasChildrenNodes)}
    >
      <ListItemIcon classes={{ root: classes.itemIcon }}>{getCollapseIcon()}</ListItemIcon>

      {TreeNode && !isGroup ? (
        <TreeNode node={data} hasChildrenNodes={hasChildrenNodes} isGroup={isGroup} />
      ) : (
        <ListItemText
          classes={{ root: classes.itemText }}
          title={getTitle()}
          inset
          primary={<span className={classes.textEllipsis}>{getTitle()}</span>}
        />
      )}
    </ListItem>
  );

  function getCollapseIcon() {
    if (hasChildrenNodes || isGroup) {
      if (isOpen) {
        return <ArrowDropDownIcon />;
      }
      return <ArrowRightIcon />;
    }
    if (NodeIcon) {
      return <NodeIcon node={data} />;
    }
    return <span />;
  }

  function getTitle() {
    if (isGroup && data[groupNode]) {
      return data[groupNode];
    }
    if (!isGroup && data[singleNode]) {
      return data[singleNode];
    }
    return 'error';
  }

  function handleListOpenClickEvent(node, hasChildrenNodes) {
    // this.props.handleSelectedClickEvent(node.fullPath);
    // this.props.onSaveChannelsSelected(node);
    const isGroup = node.groupId && node.groupName;
    if (hasChildrenNodes || isGroup) {
      onSetVisibility(node.fullPath);
    }

    if (onSelectTreeNode) {
      onSelectTreeNode(node);
    }
  }
}

TreeListNodeItem.propTypes = {
  data: PropTypes.object.isRequired
};
