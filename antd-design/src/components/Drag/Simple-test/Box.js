import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
};

const cardTarget = {
  // hover(props, monitor, component) {
  //   const dragIndex = monitor.getItem().index;
  //   const hoverIndex = props.index;
  //   if (dragIndex === hoverIndex) {
  //     return;
  //   }
  //   const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
  //   const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  //   const clientOffset = monitor.getClientOffset();
  //   const hoverClientY = clientOffset.y - hoverBoundingRect.top;
  //   if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
  //     return;
  //   }
  //   if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
  //     return;
  //   }
  //   props.moveCard(dragIndex, hoverIndex);
  //   monitor.getItem().index = hoverIndex;
  // },
};

const boxSource = {
  beginDrag(props, monitor, component) {
    return {
      name: props.name,
      box: true,
      index: -1,
    };
  },
  endDrag(props, monitor, component) {
    // monitor.didDrop() check if the drop was successful
    // monitor.getItem() get the original dragged item from getItem()
    // monitor.getDropResult() read drop result from the drop result
  },
};
@connect(({ drag }) => ({ drag }))
/* @DropTarget(ItemTypes.BOX, cardTarget, connects => ({
  connectDropTarget: connects.dropTarget(),
})) */
@DragSource('card', boxSource, (connects, monitor) => ({
  connectDragSource: connects.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Box extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  };

  state = {
    id: '21312121',
  }


  render() {
    const { isDragging, connectDragSource } = this.props;
    const { name } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return connectDragSource(<div style={{ ...style, opacity }}>{name}</div>);
  }
}
