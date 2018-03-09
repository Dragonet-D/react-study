import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'dva';
import {DragSource} from 'react-dnd';
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

const targetArr = [];

const boxSource = {
  beginDrag(props) {
    return {
      name: props.name,
    };
  },

  endDrag(props, monitor) {
    // const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      const {dispatch, details} = props;
      targetArr.push(Object.assign({key: Date.now()}, {...details}));
      dispatch({
        type: 'test/dragState',
        targetArr,
      });
      console.log(props);
      // alert(`You dropped ${item.name} into ${dropResult.name}!`) // eslint-disable-line no-alert
    }
  },
};

@connect(({test}) => ({test}))
@DragSource(ItemTypes.BOX, boxSource, (connects, monitor) => ({
  connectDragSource: connects.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Box extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  };

  render() {
    // console.log(this.props);
    const {isDragging, connectDragSource} = this.props;
    const {name} = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return connectDragSource(<div style={{...style, opacity}}>{name}</div>);
  }
}
