import React from 'react';
import { Tree } from 'antd';
import { withStyles } from '@material-ui/core/styles';

const { TreeNode } = Tree;

const styles = theme => ({
  '@global': {
    '.iscTree .ant-tree li span': {
      color: theme.palette.text.primary
    },
    '.iscTree .ant-tree li .ant-tree-node-content-wrapper:hover': {
      backgroundColor: theme.palette.background.main
    },
    '.iscTree .ant-tree li .ant-tree-node-content-wrapper:hover span': {
      color: theme.palette.background.default
    },
    '.iscTree .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected': {
      backgroundColor: theme.palette.background.main
    },
    '.iscTree .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected span': {
      color: theme.palette.background.default
    },
    '.iscTree': {
      // height: '100%'
      // overflow: "auto"
    }
  }
});

const Trees = props => {
  const { id } = props;
  return (
    <div id={id || 'iscTree'} className="iscTree">
      <Tree {...props} />
    </div>
  );
};

const AntTree = withStyles(styles)(Trees);
export { AntTree, TreeNode };
