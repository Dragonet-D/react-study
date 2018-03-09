import React, {Component} from 'react';
import {DragDropContextProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Dustbin from './Dustbin';
import Box from './Box';

export default class Container extends Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div>
          <div style={{overflow: 'hidden', clear: 'both'}}>
            <Box name="单选题" details={{id: 1, name: '单选题'}}/>
            <Box name="多选题" details={{id: 2, name: '多选题'}}/>
            <Box name="连线题" details={{id: 3, name: '连线题'}}/>
          </div>
          <div style={{overflow: 'hidden', clear: 'both'}}>
            <Dustbin/>
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}
