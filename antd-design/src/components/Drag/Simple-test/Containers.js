import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Container from './Container';
import Box from './Box';

const boxs = [
  {
    id: 1,
    text: '选择题',
  },
  {
    id: 2,
    text: '连线题目',
  },
  {
    id: 3,
    text: '多选题',
  },
];
@DragDropContext(HTML5Backend)
export default class Containers extends Component {
  render() {
    return (
      <div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          <Container/>
        </div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          {
            boxs.map((value) => {
              return (
                <Box
                  name={value.text}
                  key={value.id}
                  details={{ id: Math.random(), text: value.text }}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}
