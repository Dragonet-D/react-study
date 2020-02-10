import React from 'react';
import { makeStyles } from '@material-ui/core';
import { I18n } from 'react-i18nify';
import { Permission, UserGroupTree } from 'components/common';
import LowPriority from '@material-ui/icons/LowPriority';

const index = {
  groupNode: 'groupName', // the node that has children nodes
  singleNode: 'groupName' // the node that has no children nodes
};

const searchFields = [
  {
    title: I18n.t('security.userGroup.placeholder.treeSearch'),
    index: 'groupName'
  }
];
const useStyles = makeStyles(() => {
  return {
    containerTitle: {
      display: 'flex',
      flexDirection: 'row-reverse'
    }
  };
});
function PanelLeft(props) {
  const {
    dispatch,
    mode,
    userId,
    treeList,
    handleIsAdd,
    setActiveIndex,
    setGroupId,
    currentGroup
  } = props;
  const classes = useStyles();
  function handleSelectTreeNodeClickEvent(selectedKeys, info) {
    if (mode) {
      setActiveIndex(1);
    }
    if (selectedKeys.length === 0) return;
    if (mode) {
      setGroupId(selectedKeys.toString());
    }
    const { groupName } = info;
    if (selectedKeys[0] === 'a0001') {
      dispatch({
        type: 'securityUserGroup/getDomainList',
        payload: {
          userId
        }
      });
    }
    dispatch({
      type: 'securityUserGroup/updateUserGroupId',
      payload: {
        id: selectedKeys.toString(),
        name: groupName
      }
    });
  }
  return (
    <React.Fragment>
      {!mode && (
        <div className={classes.containerTitle} type="tool-bar">
          <Permission materialKey="M4-5">
            <span title={I18n.t('security.userGroup.tooltips.addGroup')}>
              <LowPriority onClick={handleIsAdd} />
            </span>
          </Permission>
        </div>
      )}
      <UserGroupTree
        gData={treeList}
        index={index}
        searchFields={searchFields}
        onSelectTreeNode={handleSelectTreeNodeClickEvent}
        currentGroup={currentGroup}
      />
    </React.Fragment>
  );
}
export default PanelLeft;
