import React from 'react';
import {
  DragSource
  // ConnectDragSource,
  // DragSourceConnector as connector,
  // DragSourceMonitor as monitor
} from 'react-dnd';
import { Videocam } from '@material-ui/icons';
// import { connect } from 'react-redux';
import { ListItemText } from '@material-ui/core';
// import * as ItemTypes from '../funcs/constants';

const boxSource = {
  beginDrag(props) {
    return {
      itemData: props.node
    };
  }
};
class Detail extends React.Component {
  render() {
    const { connectDragSource, node, isDragging, type, click } = this.props;
    return (
      connectDragSource &&
      connectDragSource(
        <div style={{ marginLeft: 10, display: 'flex', alignItems: 'center' }}>
          {/* <ListItemText primary={children.channelName} className="dragItem" /> */}
          <ListItemText
            className="dragItem"
            style={{ fontSize: 14 }}
            primary={isDragging ? 'isDragging' : node.channelName}
          />
          {type === 'playback' ? (
            <Videocam style={{ marginLeft: '5px' }} onClick={() => click(node)} />
          ) : null}
        </div>
      )
    );
  }
}

// ItemTypes.BOX
export default DragSource('playback', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(Detail);
