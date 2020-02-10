<!--
 * @Description: Tree Doc
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-22 17:10:15
 * @LastEditTime: 2019-08-14 14:05:08
 * @LastEditors: Kevin
 -->

#### Tree Component

- Function
  - Support custom icon
  - Support custom tree node
  - Support Search
- Parameter
  - *data :* tree data that will be used to generate tree component
  - *index :*  display the specified field at every tree node.
  - *searchFields :* it is used to placeholder of search input or search function
  - *operation :* including all callback
  - *render :* allow to customize Icon and Tree Node

```
// tree data
// if data from backend is not standard, please format tree data in corresponding model
import { getSensorListData } from 'api/securityUserGroup';
import { isSuccess } from 'utils/helpers';
import tools from 'utils/treeTools';

export default {
  namespace: 'securityUserGroup',
  state: {
    tree: []
  },
  effects: {
    *getTree({ payload }, { call, put }) {
      const { userId } = payload;
      const result = yield call(getSensorListData, userId);
      if (isSuccess(result)) {
        const data = tools.formatSensorList({
          data: result.data,
          search: ''
        });
        yield put({
          type: 'getTreeSuccess',
          payload: {
            data
          }
        });
      }
    }
  },
  reducers: {
    getTreeSuccess(state, { payload }) {
      return {
        ...state,
        tree: payload.data
      };
    }
  }
};



// component
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { useDrop, useDrag } from 'react-dnd';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import { Tree } from 'components/common';

import psImg from './images/channelPoint.png';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  treePaper: {
    width: theme.spacing(30),
    height: theme.spacing(50),
    padding: theme.spacing(2),
    margin: theme.spacing(2)
    // backgroundColor: theme.palette.background.paper
  },
  containerPaper: {
    display: 'flex',
    width: '100%',
    height: theme.spacing(50),
    margin: theme.spacing(2)
  },
  displayArea: {
    width: theme.spacing(40),
    height: theme.spacing(20),
    margin: 'auto'
  },
  itemText: {
    padding: 0,
    fontSize: 14
  },
  fullInContainer: {
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  img: {
    width: 20,
    height: 22
  },
  indent: {
    width: 8,
    height: 20
  }
}));

const index = {
  groupNode: 'groupName', // the node that has children nodes
  singleNode: 'channelName' // the node that has no children nodes
};

const searchFields = [
  {
    title: 'Channel Name',
    index: 'channelName'
  }
];

const treeOperation = {
  onSearch: () => {},
  onSelectTreeNode: node => {
    // eslint-disable-next-line no-console
    console.info('tree node information:', node);
  }
};

const treeRender = {
  NodeIcon: TreeNodeIcon,
  TreeNode: TreeNodeText
};

function SecurityUserGroup(props) {
  const { data, userId, dispatch } = props;
  const { tree } = data;
  const classes = useStyles();

  useEffect(() => {
    dispatch({
      type: 'securityUserGroup/getTree',
      payload: {
        userId
      }
    });
  }, []);
  return (
    <div className={classes.root}>
      <Paper className={classes.treePaper}>
        <Tree
          data={tree}
          index={index}
          searchFields={searchFields}
          operation={{
            onSearch: handleSearchClickEvent,
            onSelectTreeNode: handleSelectTreeNodeClickEvent
          }}
          render={treeRender}
        />
      </Paper>
      <PaperContainer />
    </div>
  );

  function handleSearchClickEvent() {}
  function handleSelectTreeNodeClickEvent(node) {
    // eslint-disable-next-line no-console
    console.info('tree node information:', node);
  }
}

const mapStateToProps = ({ securityUserGroup, global }) => {
  return {
    data: securityUserGroup,
    userId: global.userId
  };
};

export default connect(mapStateToProps)(SecurityUserGroup);

// test tree drag
const DRAG_TYPE = 'TREE_DRAG';

// target compoenent
function PaperContainer() {
  const [displayText, setDisplayText] = useState('Drag Test');
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: DRAG_TYPE,
    drop: item => {
      setDisplayText(item.node.channelName);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });
  const classes = useStyles();
  return (
    <Paper ref={drop} className={classes.containerPaper}>
      <Typography className={classes.displayArea} variant="h6" gutterBottom>
        {canDrop && isOver ? 'Release to drop' : displayText}
      </Typography>
    </Paper>
  );
}

// source compoenent
function TreeNodeText(props) {
  const { node } = props;
  const [{ isDragging }, drag] = useDrag({
    item: { type: DRAG_TYPE },
    begin: () => {
      return {
        node
      };
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const classes = useStyles();
  return (
    <ListItemText
      ref={drag}
      classes={{ root: classes.itemText }}
      inset
      primary={isDragging ? 'isDragging' : getTitle(node)}
    />
  );

  function getTitle(data) {
    const { groupName, channelName } = data;
    if (channelName) {
      return channelName;
    }
    if (groupName) {
      return groupName;
    }

    return 'error';
  }
}

// Node Icon

function TreeNodeIcon() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <img src={psImg} className={classes.img} alt="" />
    </div>
  );
}


// class tree node

const treeRender = {
  NodeIcon: TreeNodeIcon,
  TreeNode: props => {
    return <TreeNodeTextClass {...props} />; // if TreeNode is a Class Component, pls let function wrap this Component
  }
};

const styles = {
  itemText: {
    padding: 0,
    fontSize: 14
  }
};
class TreeNodeClass extends React.Component {
  getTitle(data) {
    const { groupName, channelName } = data;
    if (channelName) {
      return channelName;
    }
    if (groupName) {
      return groupName;
    }

    return 'error';
  }

  render() {
    const { node, classes } = this.props;
    return (
      <ListItemText classes={{ root: classes.itemText }} inset primary={this.getTitle(node)} />
    );
  }
}

const TreeNodeTextClass = withStyles(styles)(TreeNodeClass);
```
