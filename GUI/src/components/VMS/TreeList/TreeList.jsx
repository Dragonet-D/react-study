// import { useDrag } from 'react-dnd';
import React from 'react';
import { Tree } from 'components/common';

import Detail from './dragItem';

function TreeList(props) {
  const { dateSource, index, searchFields, treeOperation, dragType } = props;

  const treeop = {
    onSearch: (treeOperation && treeOperation.onSearch) || (() => {}),
    onSelectTreeNode: () => {}
  };

  const treeRender = {
    TreeNode: TreeNodeText
  };

  function TreeNodeText(props) {
    return (
      <Detail
        {...props}
        type={dragType}
        click={treeOperation ? treeOperation.onSelectTreeNode : () => {}}
      />
    );
  }

  return (
    <Tree
      data={dateSource}
      index={index}
      searchFields={searchFields}
      operation={treeop}
      render={treeRender}
    />
  );
}

export default TreeList;
