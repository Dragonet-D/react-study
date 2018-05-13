import React, { Component } from 'react';
import update from 'immutability-helper';
import { connect } from 'dva';
import { DropTarget } from 'react-dnd';
import Card from './Card';
import ItemTypes from './ItemTypes';

const boxTarget = {
};

@connect(({ drag }) => ({ drag }))
/* @DropTarget(ItemTypes.BOX, boxTarget, (connects, monitor) => ({
  connectDropTarget: connects.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
})) */
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {};
  }

  moveCard(dragIndex, hoverIndex) {
    const { drag, dispatch } = this.props;
    const dragCard = drag.cards[dragIndex];
    const shuffleArr = update(drag.cards, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
    });
    dispatch({
      type: 'drag/dragState',
      cards: shuffleArr,
    });
  }

  render() {
    const { canDrop, isOver, drag } = this.props;
    const isActive = canDrop && isOver;

    let backgroundColor = '#222';
    if (isActive) {
      backgroundColor = 'red';
    } else if (canDrop) {
      backgroundColor = 'green';
    }
    return (
      <div style={{ width: '400px', backgroundColor }}>
        {drag.cards.map((card, i) => {
          return (
            <Card
              key={card.id}
              index={i}
              id={card.id}
              text={card.text}
              moveCard={this.moveCard}
            />
          );
        })}
      </div>
    );
  }
}
