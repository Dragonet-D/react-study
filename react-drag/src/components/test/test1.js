import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import './test1.css';

/**
 * Implements the drag source contract.
 */
const cardSource = {
  beginDrag(props) {
    return {
      text: props.text
    };
  }
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const propTypes = {
  text: PropTypes.string.isRequired,

  // Injected by React DnD:
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
};

class Test1 extends Component {
  render() {
    const { isDragging, connectDragSource, text } = this.props;
    return connectDragSource(
        <div
            className="test1"
            style={{ opacity: isDragging ? 0.5 : 1}}
        >
          {text}
        </div>
    );
  }
}

Test1.propTypes = propTypes;

// Export the wrapped component:
export default DragSource(ItemTypes.CARD, cardSource, collect)(Test1);