import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import { Tree } from 'components/common';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import Typography from '@material-ui/core/Typography';
import styles from '../ChannelGroup.module.less';

const useStyles = makeStyles(theme => {
  return {
    listContainer: {
      height: '100%',
      width: '20%',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px',
      padding: '0px',
      marginRight: '6px',
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.primary.light}`
    },
    boxTitle: { fontSize: '0.8vw' },
    treeBox: { height: '93%', marginLeft: '15px', marginRight: '15px', position: 'relative' },
    itemText: {
      padding: 0,
      fontSize: 14
    }
  };
});

function ChannelGroupTreeBox(props) {
  const classes = useStyles();
  const { dispatch, global, VMSChannelGroup, handleAddPageStatus } = props;
  const { addPageStatus, namespace, channelTree, groupDetails } = VMSChannelGroup;
  const { userId } = global;
  const moduleName = namespace;
  const [treeData, setTreeData] = useState([]);
  // init channel tree
  useEffect(() => {
    getChannelTree();
  }, []);

  useEffect(() => {
    setTreeData(channelTree);
  }, [channelTree]);

  function getChannelTree(obj = {}) {
    dispatch({
      type: `${moduleName}/getChannelTree`,
      payload: {
        userId,
        ...obj
      }
    });
  }

  function getGroupDetailsById(obj = {}) {
    dispatch({
      type: `${moduleName}/getGroupDetailsById`,
      payload: {
        userId,
        ...obj
      }
    });
  }
  function handleSelectTreeNodeClickEvent(value) {
    getGroupDetailsById(value);
  }

  // const DRAG_TYPE = 'TREE_DRAG';
  function TreeNodeText(props) {
    const { node } = props;
    // const [{ isDragging }, drag] = useDrag({
    //   item: { type: DRAG_TYPE },
    //   begin: () => {
    //     return {
    //       node
    //     };
    //   },
    //   collect: monitor => ({
    //     isDragging: monitor.isDragging()
    //   })
    // });
    return (
      <ListItemText
        // ref={drag}
        classes={{ root: classes.itemText }}
        inset
        primary={node.groupName}
      />
    );
  }

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
  const treeRender = {
    TreeNode: TreeNodeText
  };

  return (
    <div className={classes.listContainer}>
      <div style={{ height: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '15px'
          }}
        >
          <Typography component="h5">{I18n.t('uvms.channelGroup.treeBox.headTitle')}</Typography>
          <IconButton
            className={styles.toolbar_button}
            onClick={() => handleAddPageStatus(!addPageStatus)}
          >
            <LibraryAddIcon />
          </IconButton>
        </div>

        <div className={classes.treeBox}>
          {/* <GroupSearch /> */}
          <Tree
            data={treeData}
            index={index}
            searchFields={searchFields}
            operation={{
              onSearch: () => {},
              onSelectTreeNode: handleSelectTreeNodeClickEvent
            }}
            render={treeRender}
          />

          {/* <UserGroupTree
            gData={treeData}
            index={index}
            searchFields={searchFields}
            onSelectTreeNode={handleSelectTreeNodeClickEvent}
            currentGroup={groupDetails.groupName || ''}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default connect(({ global, VMSChannelGroup }) => ({
  global,
  VMSChannelGroup
}))(ChannelGroupTreeBox);
