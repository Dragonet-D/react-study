/*
 * @Description: Tree List Node
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-21 15:29:40
 * @LastEditTime: 2019-07-23 10:45:33
 * @LastEditors: Kevin
 */

import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';

import TreeListNodeItem from './TreeListNodeItem';

export default function TreeListNode(props) {
  const { data, hasNode, children, visibility } = props;
  const isOpen = !!visibility[data.fullPath];
  if (hasNode) {
    return (
      <React.Fragment>
        <TreeListNodeItem {...props} data={data} />
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding dense>
            {children}
          </List>
        </Collapse>
      </React.Fragment>
    );
  }

  return <TreeListNodeItem {...props} data={data} />;
}

TreeListNode.propTypes = {
  data: PropTypes.object.isRequired
};
