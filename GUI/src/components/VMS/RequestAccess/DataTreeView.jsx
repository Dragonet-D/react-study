import React from 'react';
import { makeStyles } from '@material-ui/core';
// import LibraryAdd from '@material-ui/icons/LibraryAdd';
// import { ToolTip } from 'components/common';
import { Tree } from 'antd';

const { TreeNode } = Tree;
const useStyles = makeStyles(theme => {
  return {
    treeNode: {
      width: '300%',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: theme.palette.text.secondary
    },
    treeTextName: {
      position: 'absolute',
      marginLeft: '30px',
      marginRight: '30px',
      left: '200px'
    },
    treeTextDesc: {
      position: 'absolute',
      marginLeft: '30px',
      marginRight: '30px',
      left: '400px'
    }
  };
});

function DataTreeView(props) {
  const { dataSource, selectKey } = props;
  const classes = useStyles();
  const [checkedKey, setcheckedKey] = React.useState([]);

  React.useEffect(() => {
    selectKey(checkedKey);
  }, [checkedKey]);

  function renderTreeData(name, disc) {
    return (
      <div className={classes.treeNode}>
        <span className={classes.treeTextName}>{name}</span>
        <span className={classes.treeTextDesc}>{disc}</span>
      </div>
    );
  }

  function basicComponent(_dataSource) {
    return _dataSource.map(x => {
      if (x.children) {
        return (
          <TreeNode
            title={renderTreeData(x.groupName, x.groupDescription)}
            key={x.groupId}
            dataRef={x}
            selectable={false}
          >
            {basicComponent(x.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={renderTreeData(x.groupName, x.groupDescription)}
          key={x.groupId}
          dataRef={x}
          selectable={false}
        />
      );
    });
  }

  function onCheck(_checkedKeys) {
    setcheckedKey(_checkedKeys);
  }

  return (
    <Tree checkable onCheck={onCheck} key="root" style={{ width: '100%' }}>
      {basicComponent(dataSource)}
    </Tree>
  );
}

export default DataTreeView;

// renderTreeNodes = data =>
//   data.map(item => {
//     if (item.children) {
//       return (
//         <TreeNode title={item.title} key={item.key} dataRef={item}>
//           {this.renderTreeNodes(item.children)}
//         </TreeNode>
//       );
//     }
//     return <TreeNode {...item} />;
//   });
