import React from 'react';
import _ from 'lodash';
import { AntTree, TreeNode } from 'components/common';

function FaceChannel(props) {
  const { getChannelGroup, onSelectCams, getChannel, expandTarget } = props; // getChannel
  const [treeData, setTreeData] = React.useState([]);
  const [expandedKeys, setExpandedKeys] = React.useState([]);
  const itemMap = React.useRef();
  itemMap.current = new Map();

  // const getChannelG = React.useCallback(async () => {
  //   const tree = await getChannelGroup();
  //   setTreeData([tree]);
  // }, [getChannelGroup]);

  React.useEffect(() => {
    if (expandTarget.length) {
      let conArr = [];
      expandTarget.forEach(x => {
        conArr = conArr.concat(getOpenKey(treeData, x));
      });
      conArr = [...new Set(conArr)];
      conArr.forEach(el => {
        const node = itemMap.current.get(el);
        onLoadData(node).then(() => {
          conArr = expandedKeys.concat(conArr);
          expand(conArr);
        });
      });
      // conArr = expandedKeys.concat(conArr);
      // expand(conArr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandTarget]);

  // async function getChannelsByGroupId(id) {}

  React.useEffect(() => {
    getChannelG();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getChannelG() {
    const tree = await getChannelGroup();
    console.log(getOpenKey([tree], 'b7ada1fc-e6ee-4092-a438-0d6a41349486'));
    setTreeData(tree ? [tree] : []);
  }

  function renderTreeNodes(data) {
    return data.map(item => {
      if (item && item.children) {
        const node = (
          <TreeNode title={item.groupName} key={item.groupId} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
        if (!itemMap.current.has(item.groupId)) {
          itemMap.current.set(item.groupId, node);
        }
        return node;
      }

      return <TreeNode key={item.channelId} {...item} title={item.channelName} dataRef={item} />;
    });
  }

  function getOpenKey(tree, id) {
    const keyArr = [];
    let done = false;
    function rec(tree, id) {
      tree.forEach((x, i) => {
        if (!done) {
          if (i > 0) {
            keyArr.pop();
          }
          keyArr.push(x.groupId);
          if (x.groupId === id) {
            done = true;
            return 0;
          } else if (x.children) {
            rec(x.children, id);
          }
        }
      });
    }
    if (!done) {
      keyArr.pop();
    }
    rec(tree, id);
    return keyArr;
  }

  function set(e) {
    const treeData = _.cloneDeep(e);
    setTreeData(treeData);
  }

  // function openKey(key) {
  //   const eKeys = _.cloneDeep(expandedKeys);
  //   setExpandedKeys(eKeys.push(key));
  // }

  function filterTreeNode(node) {
    console.log(node);
  }

  function onSelect(keys) {
    const content = [];
    keys.forEach(el => {
      content.push(itemMap.get(el).props.dataRef);
    });
    onSelectCams(content);
  }

  function expand(keys) {
    setExpandedKeys(keys);
  }

  function onLoadData(treeNode) {
    return new Promise(resolve => {
      // if (treeNode.props.children && treeNode.props.children.length) {
      //   resolve();
      //   return;
      // }
      if (treeNode.props.dataRef.isLeaf) {
        resolve();
      }
      const channels = getChannel(treeNode.props.dataRef.groupId);
      channels.then(res => {
        if (res && res.length) {
          res.forEach(x => {
            x.isLeaf = true;
          });
          if (treeNode.props.dataRef.children && treeNode.props.dataRef.children.length) {
            treeNode.props.dataRef.children = treeNode.props.dataRef.children.concat(res);
          } else {
            treeNode.props.dataRef.children = res;
          }
          resolve(treeData);
        } else if (res && !treeNode.props.dataRef.children.length) {
          treeNode.props.dataRef.children = [
            {
              channelName: 'No Channel',
              isLeaf: true,
              disabled: true,
              selectable: false,
              checkable: false
            }
          ];
          resolve(treeData);
        } else {
          resolve();
        }
      });
    }).then(res => {
      if (res) {
        set(res);
      }
    });
  }

  function onCheck(keys) {
    console.log(keys);
  }

  return (
    <AntTree
      checkable
      onCheck={onCheck}
      loadData={onLoadData}
      expandedKeys={expandedKeys}
      onExpand={expand}
      filterTreeNode={filterTreeNode}
      onSelect={onSelect}
    >
      {renderTreeNodes(treeData)}
    </AntTree>
  );
}

export default FaceChannel;
