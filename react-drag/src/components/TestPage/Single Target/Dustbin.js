import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import {connect} from 'dva';
import ItemTypes from './ItemTypes';

const style = {
  minHeight: '300px',
  width: '12rem',
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
    return {name: 'Dustbin'};
  },
};

@connect(({test}) => ({test}))
@DropTarget(ItemTypes.BOX, boxTarget, (connects, monitor) => ({
  connectDropTarget: connects.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export default class Dustbin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      target: [],
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(nextProps);
  //   const {test} = nextProps;
  //   if (test.payload && test.payload.dragOver) {
  //     // console.log(test.payload);
  //     this.state.target.push(Object.assign({key: Date.now()}, {...test.payload}));
  //     return false;
  //   }
  //   return true;
  // }

  render() {
    console.log(this.props);
    const {canDrop, connectDropTarget, isOver, test} = this.props;
    const isActive = canDrop && isOver;
    let backgroundColor = '#222';
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }

    return connectDropTarget(
      <div style={{...style, backgroundColor}}>
        {isActive ? '释放' : '拖一道题过来'}
        {
          test.targetArr ? test.targetArr.map((item) => {
            return (
              <div key={item.key}>{item.name}</div>
            );
          }) : ''
        }
      </div>,
    );
  }
}
