import React, { useState, useEffect, useCallback } from 'react';
import { TextField } from 'components/common';
import { I18n } from 'react-i18nify';
import { Icon } from 'antd';
import 'antd/dist/antd.css';
import { AntTree, TreeNode } from './Tree';

function ChannelGroupTree(props) {
  const { id, gData, onSelectTreeNode, currentGroup, icon, render } = props;
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const dataList = [];
  const generateList = data => {
    if (!data) return;
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      if (node.children && node.children.length > 0) {
        const { groupId, groupName } = node;
        dataList.push({ key: groupId, title: groupName });
        generateList(node.children);
      } else {
        const { channelId, channelName } = node;
        dataList.push({ key: channelId, title: channelName });
      }
    }
  };
  generateList(gData);

  const getParentKey = useCallback((key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children && node.children.length > 0) {
        if (node.children.some(item => item.channelId === key)) {
          parentKey = node.groupId;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  }, []);
  useEffect(() => {
    if (currentGroup) {
      const expandedKeys = dataList
        .map(item => {
          if (item.title === currentGroup) {
            return getParentKey(item.key, gData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      setExpandedKeys(expandedKeys);
      setSearchValue(currentGroup);
      setAutoExpandParent(true);
    }
  }, [gData, currentGroup, dataList, getParentKey, expandedKeys.length]);

  function onChange(e) {
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.toLowerCase().indexOf(value.toLowerCase()) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  }
  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  const loop = data =>
    data &&
    data.map(item => {
      let name = '';
      if (item.children && item.children.length > 0) {
        name = 'groupName';
      } else {
        name = 'channelName';
      }
      const index = item[name].toLowerCase().indexOf(searchValue.toLowerCase());
      const matchStr = item[name].substr(index, searchValue.length);
      const beforeStr = item[name].substr(0, index);
      const afterStr = item[name].substr(index + searchValue.length);
      const channelName =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{matchStr}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.channelName}</span>
        );
      const groupName =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{matchStr}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.groupName}</span>
        );
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            key={item.groupId}
            title={groupName}
            icon={<Icon type="enviroment" theme="twoTone" />}
          >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.channelId}
          icon={<Icon type={icon} />}
          title={render(channelName, item)}
        />
      );
    });
  return (
    <div id={id || 'iscTree'} className="iscTree">
      <TextField
        fullWidth
        style={{ marginBottom: 8 }}
        placeholder={I18n.t('global.button.search')}
        onChange={onChange}
        margin="dense"
      />
      <AntTree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onSelect={onSelectTreeNode}
      >
        {loop(gData)}
      </AntTree>
    </div>
  );
}

export default ChannelGroupTree;
