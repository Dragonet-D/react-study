import React, {Component} from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
import Board from './components/board/board';
import './App.css';

class App extends Component {
  render() {
    return (
        <div className="App">
          <Board knightPosition={[7, 4]}/>
        </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
