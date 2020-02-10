import React from 'react';
import { DragSource } from 'react-dnd';
import { ListItemText, ListItemIcon } from '@material-ui/core';
import DragIndicator from '@material-ui/icons/DragIndicator';

const boxSource = {
  beginDrag(props) {
    return {
      itemData: props.node
    };
  }
};
class DragListItem extends React.Component {
  render() {
    const { connectDragSource, node, isDragging } = this.props;
    return (
      connectDragSource &&
      connectDragSource(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon>
            <DragIndicator />
          </ListItemIcon>
          <ListItemText
            className="dragItem"
            style={{ fontSize: 14 }}
            primary={isDragging ? 'isDragging' : node.name}
          />
        </div>
      )
    );
  }
}

export default DragSource('playback', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(DragListItem);
