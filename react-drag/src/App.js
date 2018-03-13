import React, {Component} from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
import Board from './components/board/board';
import './App.css';

@DragDropContext(HTML5Backend)
export default class App extends Component {
  render() {
    return (
        <div className="App">
          <Board knightPosition={[7, 4]}/>
        </div>
    );
  }
}
