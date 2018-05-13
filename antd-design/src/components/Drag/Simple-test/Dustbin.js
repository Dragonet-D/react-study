import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';
import Container from './Container';
import ItemTypes from './ItemTypes';

const style = {
  height: '100%',
  width: '430px',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
};

const boxTarget = {
  drop() {
    return { name: 'Dustbin' };
  },
  hover(props, monitor, component) {
    // console.log(component);
    // console.log(component);
  },
};

@DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export default class Dustbin extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
  };

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    let backgroundColor = '#222';
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }

    return connectDropTarget(
      <div style={{ ...style, backgroundColor }}>
        <div style={{ height: '30px', lineHeight: '30px' }}>
          {isActive ? 'Release to drop' : 'Drag a box here'}
        </div>
        <Container/>
      </div>,
    );
  }
}
