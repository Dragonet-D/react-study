/*
 * @Description: Tree
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-21 14:34:03
 * @LastEditTime: 2019-08-26 19:47:21
 * @LastEditors: Kevin
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'utils/createContext';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TreeSearch from './TreeSearch';
import TreeList from './TreeList';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    paddingBottom: theme.spacing(4.5)
  }
}));

export default function Tree(props) {
  const { operation, render, data, index, searchFields } = props;
  const { onSearch, onSelectTreeNode } = operation;
  const { groupNode, singleNode } = index;
  const { NodeIcon, TreeNode } = render;
  const [visibility, setVisibility] = useState({});
  const context = { TreeNode, NodeIcon, onSelectTreeNode, groupNode, singleNode };
  const classes = useStyles();
  return (
    <Provider value={context}>
      <div className={classes.root}>
        <TreeSearch onSearchTree={onSearch} searchFields={searchFields} />
        <TreeList data={data} onSetVisibility={onSetVisibility} visibility={visibility} />
      </div>
    </Provider>
  );

  function onSetVisibility(path) {
    setVisibility(state => ({
      ...state,
      [path]: !state[path]
    }));
  }
}

Tree.defaultProps = {
  data: [],
  render: {
    NodeIcon: null,
    TreeNode: null
  },
  operation: {
    onSearch: () => {},
    onSelectTreeNode: () => {}
  },
  searchFields: [
    {
      title: '',
      index: ''
    }
  ]
};

Tree.propTypes = {
  data: PropTypes.array,
  index: PropTypes.shape({
    groupNode: PropTypes.string,
    singleNode: PropTypes.string
  }).isRequired,
  operation: PropTypes.shape({
    onSearch: PropTypes.func,
    onSelectTreeNode: PropTypes.func
  }),
  render: PropTypes.object,
  searchFields: PropTypes.array
};
