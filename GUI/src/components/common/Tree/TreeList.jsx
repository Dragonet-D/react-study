/*
 * @Description: Tree List
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-21 14:34:15
 * @LastEditTime: 2019-07-23 10:47:43
 * @LastEditors: Kevin
 */

import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import List from '@material-ui/core/List';

import TreeListNode from './TreeListNode';

const useStyles = makeStyles(() => ({
  scrollList: {
    overflow: 'auto',
    height: '100%',
    width: '100%'
  },
  listRoot: {
    whiteSpace: 'nowrap'
  }
}));

export default function TreeList(props) {
  const { data } = props;
  const classes = useStyles();
  return (
    <div className={classes.scrollList}>
      <List className={classes.listRoot} disablePadding dense>
        {loop(data)}
      </List>
    </div>
  );

  function loop(data) {
    return data.map(item => {
      const hasNode = Array.isArray(item.children) && item.children.length > 0;
      if (hasNode) {
        return (
          <TreeListNode {...props} key={item.fullPath} data={item} hasNode={hasNode}>
            {loop(item.children)}
          </TreeListNode>
        );
      }
      return <TreeListNode {...props} key={item.fullPath} data={item} />;
    });
  }
}

TreeList.propTypes = {
  data: PropTypes.array.isRequired
};
