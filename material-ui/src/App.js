import React, { Component } from 'react';
import IconButtonExampleComplex from './components/iconButton';
import TableExampleComplex from './components/table';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div style={{display: 'none'}}>
          <IconButtonExampleComplex/>
        </div>
        <TableExampleComplex/>
      </div>
    );
  }
}

export default App;
