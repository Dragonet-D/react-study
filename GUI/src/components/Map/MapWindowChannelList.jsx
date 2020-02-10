import React from 'react';
import classNames from 'classnames';
import { I18n } from 'react-i18nify';
import { useDrag } from 'react-dnd';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ChannelGroupTree, DialogWindow } from 'components/common';
import { DRAG_TYPE } from './constants';
import psImg from './images/channelPoint.png';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex'
  },
  itemText: {
    padding: 0,
    fontSize: 14
  },
  img: {
    width: 20,
    height: 22
  },
  imgDragging: {
    opacity: 0.5
  },
  treeNode: {
    display: 'flex'
  },
  treeNodeName: {
    display: 'inline-block',
    marginLeft: 5
  }
}));

export default function MapWindowChannelList(props) {
  const { treeData, dispatch } = props;
  const classes = useStyles();
  return (
    <>
      <DialogWindow
        title={I18n.t('map.windowChannelTree.title')}
        properties={{
          default: { x: 58, y: 50, width: 220, height: 350 },
          minWidth: 220,
          minHeight: 300
        }}
        operation={{}}
      >
        <ChannelGroupTree
          gData={treeData}
          index={index}
          searchFields={searchFields}
          onSelectTreeNode={handleSelectTreeNodeClickEvent}
          render={(channelName, node) => {
            return (
              <div className={classes.treeNode}>
                <TreeNodeIcon node={node} />
                <span className={classes.treeNodeName}>{channelName}</span>
              </div>
            );
          }}
        />
      </DialogWindow>
    </>
  );

  function handleSelectTreeNodeClickEvent(selectedKeys, node) {
    dispatch({
      type: 'map/setChannelSelected',
      payload: {
        data: [{ channelId: selectedKeys, node }]
      }
    });
  }
}

const index = {
  groupNode: 'groupName', // the node that has children nodes
  singleNode: 'channelName' // the node that has no children nodes
};

const searchFields = [
  {
    title: I18n.t('map.windowChannelTree.placeholder'),
    index: 'channelName'
  }
];

// Node Icon
function TreeNodeIcon({ node }) {
  const classes = useStyles();
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
  return (
    <div className={classes.root}>
      <img
        ref={drag}
        src={psImg}
        className={classNames(classes.img, {
          [classes.imgDragging]: isDragging
        })}
        alt=""
      />
    </div>
  );
}
