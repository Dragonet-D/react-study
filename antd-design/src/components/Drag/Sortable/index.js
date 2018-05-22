import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import Card from './Card';
import './index.less';

class Sortable extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
  }

  moveCard(dragIndex, hoverIndex) {
    const { drag } = this.props;
    const dragCard = drag[dragIndex];
    const shuffleArr = update(drag, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
    });
    this.props.cardDrag(shuffleArr);
  }

  render() {
    const { drag } = this.props;
    return (
      <div className="drag_wrap">
        {drag ? drag.map((card, i) => {
          return (
            <Card
              key={card.key}
              index={i}
              id={card.key}
              text={card.title}
              moveCard={this.moveCard}
            />
          );
        }) : ''}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Sortable);
